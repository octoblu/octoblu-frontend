/**
 * Copyright 2013 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
var RED = function() {

    $('#btn-keyboard-shortcuts').click(function(){showHelp();});

    function hideDropTarget() {
        $("#dropTarget").hide();
        RED.keyboard.remove(/* ESCAPE */ 27);
    }

    $('#chart').on("dragenter",function(event) {
        if ($.inArray("text/plain",event.originalEvent.dataTransfer.types) != -1) {
            $("#dropTarget").css({display:'table'});
            RED.keyboard.add(/* ESCAPE */ 27,hideDropTarget);
        }
    });

    $('#dropTarget').on("dragover",function(event) {
        if ($.inArray("text/plain",event.originalEvent.dataTransfer.types) != -1) {
            event.preventDefault();
        }
    })
    .on("dragleave",function(event) {
        hideDropTarget();
    })
    .on("drop",function(event) {
        var data = event.originalEvent.dataTransfer.getData("text/plain");
        hideDropTarget();
        RED.view.importNodes(data);
        event.preventDefault();
    });


    function save(force) {
        if (RED.view.dirty()) {

            if (!force) {
                var invalid = false;
                var unknownNodes = [];
                RED.nodes.eachNode(function(node) {
                        invalid = invalid || !node.valid;
                        if (node.type === "unknown") {
                            if (unknownNodes.indexOf(node.name) == -1) {
                                unknownNodes.push(node.name);
                            }
                            invalid = true;
                        }
                });
                if (invalid) {
                    if (unknownNodes.length > 0) {
                        $( "#node-dialog-confirm-deploy-config" ).hide();
                        $( "#node-dialog-confirm-deploy-unknown" ).show();
                        var list = "<li>"+unknownNodes.join("</li><li>")+"</li>";
                        $( "#node-dialog-confirm-deploy-unknown-list" ).html(list);
                    } else {
                        $( "#node-dialog-confirm-deploy-config" ).show();
                        $( "#node-dialog-confirm-deploy-unknown" ).hide();
                    }
                    $( "#node-dialog-confirm-deploy" ).dialog( "open" );
                    return;
                }
            }
            var nns = RED.nodes.createCompleteNodeSet();

            $("#btn-icn-deploy").removeClass('icon-upload');
            $("#btn-icn-deploy").addClass('spinner');
            RED.view.dirty(false);

            RED.rpc('saveFlows',[nns],function(err,resp) {
                    $("#btn-icn-deploy").removeClass('spinner');
                    $("#btn-icn-deploy").addClass('icon-upload');
                    if (resp) {
                        RED.notify("Successfully deployed","success");
                        RED.nodes.eachNode(function(node) {
                            if (node.changed) {
                                node.dirty = true;
                                node.changed = false;
                            }
                        });
                        // Once deployed, cannot undo back to a clean state
                        RED.history.markAllDirty();
                        RED.view.redraw();
                    } else {
                        RED.view.dirty(true);
                        if (resp) {
                            RED.notify("<strong>Error</strong>: "+resp,"error");
                        } else {
                            RED.notify("<strong>Error</strong>: no response from server","error");
                        }
                        console.log(err,resp);
                    }
            });
        }
    }

    $('#btn-deploy').click(function() { save(); });

    $( "#node-dialog-confirm-deploy" ).dialog({
            title: "Confirm deploy",
            modal: true,
            autoOpen: false,
            width: 530,
            height: 230,
            buttons: [
                {
                    text: "Confirm deploy",
                    click: function() {
                        save(true);
                        $( this ).dialog( "close" );
                    }
                },
                {
                    text: "Cancel",
                    click: function() {
                        $( this ).dialog( "close" );
                    }
                }
            ]
    });

    function loadSettings() {
        RED.rpc('settings', function(err, data){
            console.log('settings', err, data);
            RED.settings = data;
            loadNodes();
            RED.library.loadFlowLibrary();
        });
    }
    function loadNodes() {
        RED.rpc('getNodes', function(err, data) {
                $("body").append(data);
                $(".palette-spinner").hide();
                $(".palette-scroll").show();
                $("#palette-search").show();
                loadFlows();
        });
    }

    function loadFlows() {
        RED.rpc('getFlows',function(err, nodes) {
                RED.nodes.import(nodes);
                RED.view.dirty(false);
                RED.view.redraw();
        });
    }

    function showHelp() {

        var dialog = $('#node-help');

        //$("#node-help").draggable({
        //        handle: ".modal-header"
        //});

        dialog.on('show',function() {
                RED.keyboard.disable();
        });
        dialog.on('hidden',function() {
                RED.keyboard.enable();
        });

        dialog.modal();
    }

    $(function() {
            RED.keyboard.add(/* ? */ 191,{shift:true},function(){showHelp();d3.event.preventDefault();});
            wsConnect(loadSettings);
    });



    function wsConnect(ready) {
            var path = location.hostname+":"+location.port+document.location.pathname;
            //TODO place uuid/token and port in from $scope.currentUser.skynetuuid  $scope.currentUser.skynettoken $scope.redPort;
            path = uuid + ':' + token + '@designer.octoblu.com:' + port;
            path = path+(path.slice(-1) == "/"?"":"/")+"ws";
            path = "ws"+(document.location.protocol=="https:"?"s":"")+"://"+path;

            //if you want to point to a different backend host:
            //path = 'ws://localhost:1880/ws';

            console.log('ws path', path);
            RED.ws = new WebSocket(path);
            RED.ws.onopen = function() {
                if (RED.errornotification) {
                    RED.errornotification.close();
                    RED.errornotification = null;
                }
                if(ready){
                  ready();
                }
                //console.log("debug ws connected");
            };
            RED.ws.onmessage = function(event) {
                var o = null;
                try{
                    o = JSON.parse(event.data);
                }catch(exp){
                    console.log('err parsing ws response', exp);
                }
                if(o){
                    //console.log('ws message', o);
                    if(o.name == 'rpc' && o.data){
                        var rpc = o.data;
                        //console.log('rpc', rpc);
                        if(RED._rpcResolvers[rpc.id]){

                            RED._rpcResolvers[rpc.id](rpc.error, rpc.result);
                        }
                    }else{
                        $.publish(o.name, o.data);
                    }
                }

            };
            RED.ws.onclose = function() {
                if (RED.errornotification == null) {
                    RED.errornotification = RED.notify("<b>Error</b>: Lost connection to server","error",true);
                }
                setTimeout(wsConnect,1000);
            };

            RED._rpcCount = 0;
            RED._rpcResolvers = {};
            RED.rpc = function(method, params, callback){
                if(!callback){
                    callback = params;
                    params = [];
                }
                RED._rpcCount++;
                if(!Array.isArray(params)){
                    params = [params];
                }
                var message = {
                    name: 'rpc',
                    data:
                    {
                        id: RED._rpcCount,
                        method: method,
                        params: params
                    }
                };
                if(callback){
                    RED._rpcResolvers[RED._rpcCount] = callback;
                }
                RED.ws.send(JSON.stringify(message));

            };
        }

    return {
    };
}();
