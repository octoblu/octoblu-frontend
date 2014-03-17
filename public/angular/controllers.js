angular.module('e2eApp')
    .controller('mainController', function($scope, $location, $anchorScroll, $modal, channelService) {
        $("#main-nav").hide();
        user = $.cookie("skynetuuid");
        if(user != undefined ){
            window.location.href = "/dashboard";
        } else {
            $scope.message = 'Home page content pending.';
        }

        channelService.getList(function(data) {
            $scope.availableChannels = data;
        });

        $scope.gotoApis = function (){
            // set the location.hash to the id of
            // the element you wish to scroll to.
            $location.hash('apis');

            // call $anchorScroll()
            $anchorScroll();
        };

        $(document).ready(function () {
            /*SLIDE*/
            $(document).ready(function () {
                athenaSlide(
                    athenaSlideId = 'slidecontent',
                    athenaPreviousButtonId = 'slide-previous',
                    athenaNextButtonId = 'slide-next',
                    athenaDotButtonClass = 'slide-dot',
                    athenaDotActiveClass = 'slide-active',
                    athenaPlayButtonId = 'slide-play',
                    athenaStopButtonId = 'slide-stop',
                    /**MORE OPTIONS**/
                    athenaSlideMode = 'sliding',
                    athenaSlideTime = 500,
                    athenaSlideDelay = 500,
                    athenaSlideEffect = 'swing',
                    athenaAutoStartLoop = true,
                    athenaLoopTime = 10000
                );
            });
        });

        $scope.watchVideo = function() {
          var modalInstance = $modal.open({
            templateUrl: 'watchVideo.html',
            scope: $scope,
            controller: function ($modalInstance) {
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }
          });
        };


    })
    .controller('aboutController', function($scope, $http, $injector, $location) {
        $scope.message = 'About page content pending.';
        checkLogin($scope, $http, $injector, false, function(){});
    })

    .controller('contactController', function($scope, $http, $injector, $location) {
        $scope.message = 'Contact page content pending.';
        checkLogin($scope, $http, $injector, false, function(){});

    })
    .controller('signupController', function($scope, $location) {
    })
    .controller('loginController', function($scope, $http) {
        console.log('login');
        user = $.cookie("skynetuuid");
        console.log(user);
        if (user != undefined){
            window.location.href = "/dashboard";
        }
    })
    .controller('profileController', function($scope, $http, $injector, $location) {
        checkLogin($scope, $http, $injector, false, function(){
//    $(".active").removeClass();
//    $("#main-nav").show();
//    $("#main-nav-bg").show();

        });
    })
    .controller('servicesController', function($scope, $http, $injector, $location) {
        checkLogin($scope, $http, $injector, false, function(){
//    $(".active").removeClass();
//    $("#main-nav").show();
//    $("#main-nav-bg").show();

        });
    })
    .controller('docsController', function($scope, $http, $injector, $location) {
        checkLogin($scope, $http, $injector, false, function(){
//    $(".active").removeClass();
//    $("#nav-resources").addClass('active');
//    $("#main-nav").show();
//    $("#main-nav-bg").show();

        });
    })
    .controller('faqsController', function($scope, $http, $injector, $location) {
        checkLogin($scope, $http, $injector, false, function(){
//    $(".active").removeClass();
//    $("#nav-resources").addClass('active');
//    $("#main-nav").show();
//    $("#main-nav-bg").show();

        });
    })
    .controller('pricingController', function($scope, $http, $injector, $location) {
        checkLogin($scope, $http, $injector, false, function(){
//    $(".active").removeClass();
//    $("#nav-resources").addClass('active');
//    $("#main-nav").show();
//    $("#main-nav-bg").show();
        });
    })
    .controller('dashboardController', function($scope, $http, $injector, $location, ownerService) {
        $scope.message = 'Contact page content pending.';
        checkLogin($scope, $http, $injector, false, function(){
//    $(".active").removeClass();
//    $("#nav-dashboard").addClass('active');
//    $("#main-nav").show();
//    $("#main-nav-bg").show();

            var dataPoints = [];
            var deviceData = [];
            var chart;

            // connect to skynet
            var skynetConfig = {
                "uuid": $scope.skynetuuid,
                "token": $scope.skynettoken
            }
            skynet(skynetConfig, function (e, socket) {
                if (e) throw e

                // Get user's devices
                ownerService.getDevices($scope.skynetuuid, $scope.skynettoken, function(data) {
                    $scope.devices = data.devices;

                    // Subscribe to user's devices messages and events
                    if(data.devices) {
                        for (var i = 0; i < data.devices.length; i++) {
                            socket.emit('subscribe', {
                                "uuid": data.devices[i].uuid,
                                "token": data.devices[i].token
                            }, function (data) {
                                // console.log(data);
                            });

                            // Setup dashboard arrays for devices
                            dataPoints.push({label: data.devices[i].name, y: 0, uuid: data.devices[i].uuid });
                            deviceData[data.devices[i].uuid] = 0;

                        }

                    }

                    // http://canvasjs.com/ << TODO: pucharse $299
                    chart = new CanvasJS.Chart("chartContainer", {
                        theme: "theme2",//theme1
                        title:{
                            text: "Real-time Device Activity"
                        },
                        data: [
                            {
                                // Change type to "column", bar", "splineArea", "area", "spline", "pie",etc.
                                type: "splineArea",
                                dataPoints: dataPoints
                            }
                        ]
                    });

                    chart.render();

                });

                socket.on('message', function(channel, message){

                    if($scope.skynetuuid == channel){
                        alert(JSON.stringify(message));
                    }

                    console.log('message received', channel, message);
                    deviceData[channel] = deviceData[channel] + 1;
                    for (var i = 0; i < dataPoints.length; i++) {
                        if(dataPoints[i].uuid == channel){
                            dataPoints[i].y = deviceData[channel];
                        }
                    }
                    chart.options.data[0].dataPoints = dataPoints
                    chart.render();

                });
            });

        });
    })
    .controller('controllerController', function($scope, $http, $injector, $location, ownerService, messageService) {
        checkLogin($scope, $http, $injector, false, function(){
//    $(".active").removeClass();
//    $("#nav-controller").addClass('active');
//    $("#main-nav").show();
//    $("#main-nav-bg").show();

            // Get user gateways
            ownerService.getGateways($scope.skynetuuid, $scope.skynettoken, true, function(data) {
                console.log('Devices and Gateways', data);
                $scope.devices = data.gateways;
            });

            // connect to skynet
            var skynetConfig = {
                "uuid": $scope.skynetuuid,
                "token": $scope.skynettoken
            }
            skynet(skynetConfig, function (e, socket) {
                if (e) throw e

                $scope.getSubdevices = function (device){
                    if (device.type == 'gateway'){
                        $scope.subdevices = device.subdevices;
                    }
                }


                $scope.getSchema = function (device, subdevice){
                    console.log('device', device);
                    console.log('subdevice', subdevice);
                    $('#device-msg-editor').jsoneditor('destroy');

                    for (var i in device.plugins) {
                        var plugin = device.plugins[i];
                        if(plugin.name === subdevice.type && plugin.messageSchema){
                            $scope.schema = plugin.messageSchema;
                            $scope.schema.title = subdevice.name;
                        }
                    }
                    console.log($scope.schema);

                    if($scope.schema ){

                        $('#device-msg-editor').jsoneditor({
                            schema : $scope.schema,
                            theme  : 'bootstrap3',
                            no_additional_properties: true,
                            iconlib : 'bootstrap3'
                        });

                    }
                };


                socket.on('message', function(channel, message){
                    alert('Message received from ' + channel + ': ' + message);
                });


                $scope.sendMessage = function(){
                    /*
                     if schema exists - get the value from the editor, validate the input and send the message if valid
                     otherwise notify the user that there was an error.

                     if no schema exists, they are doing this manually and we check if the UUID field is populated and that
                     there is a message to send.
                     */

                    var message;

                    if($scope.sendUuid === undefined || $scope.sendUuid == ""){
                        if($scope.device){
                            var uuid = $scope.device.uuid;
                        } else {
                            var uuid = "";
                        }
                    } else {
                        var uuid = $scope.sendUuid;
                    }

                    if(uuid){

                        if($scope.schema){
                            var errors = $('#device-msg-editor').jsoneditor('validate');
                            if(errors.length){
                                alert(errors);
                            } else{
                                // if ($scope.sendText != ""){
                                //   message = $scope.sendText;
                                //   if(typeof message == "string"){
                                //     message = JSON.parse($scope.sendText);
                                //   }
                                // } else {
                                message = $('#device-msg-editor').jsoneditor('value');
                                console.log('schema message', message);
                                // }

                                $scope.subdevicename = $scope.subdevice.name;
                            }

                        } else{
                            message = $scope.sendText;
                            try{
                                if(typeof message == "string"){
                                    message = JSON.parse($scope.sendText);
                                }
                                // message = message.message;
                                $scope.subdevicename = message.subdevice;
                                delete message["subdevice"];

                            } catch(e){
                                message = $scope.sendText;
                                $scope.subdevicename = "";
                            }

                        }


                        socket.emit('message', {
                            "devices": uuid,
                            "subdevice": $scope.subdevicename,
                            "message": message
                        }, function(data){
                            console.log(data);
                        });
                        $scope.messageOutput = "Message Sent: " + JSON.stringify(message);

                    }
                }

            });

        });
    })
    .controller('adminController', function($scope, $http, $injector, $location) {
        checkLogin($scope, $http, $injector, false, function(){
//    $(".active").removeClass();
//    $("#nav-admin").addClass('active');
//    $("#main-nav").show();
//    $("#main-nav-bg").show();

        });
    })
    .controller('connectorController', function($scope, $http, $injector, $location, $modal, $log, $q, $modal, $state,ownerService, deviceService, channelService) {
        $scope.skynetStatus = false;
        $scope.channelList = [];
        $scope.predicate = 'name';

        checkLogin($scope, $http, $injector, true, function(){
//    $(".active").removeClass();
//    $("#nav-connector").addClass('active');
//    $("#main-nav").show();
//    $("#main-nav-bg").show();
//
//    if($location.$$path == "/connector" || $location.$$path == "/devices") {
//      $scope.activeTab = 'devices';
//      $("#devices").addClass('active');
//    } else if($location.$$path == "/gateways") {
//      $scope.activeTab = 'gateways';
//    } else if($location.$$path == "/apis") {
//      $scope.activeTab = 'apis';
//    } else if($location.$$path == "/people") {
//      $scope.activeTab = 'people';
//    } else if($location.$$path == "/tools") {
//      $scope.activeTab = 'devtools';
//    }

            $scope.navType = 'pills';
            // $scope.navType = 'tabs';

            // connect to skynet
            var skynetConfig = {
                "uuid": $scope.skynetuuid,
                "token": $scope.skynettoken
            }
            skynet(skynetConfig, function (e, socket) {
                if (e) throw e


                // Get user devices
                ownerService.getDevices($scope.skynetuuid, $scope.skynettoken, function(data) {
                    $scope.devices = data.devices;
                    for (var i in $scope.devices) {
                        if($scope.devices[i].type == 'gateway'){
                            $scope.devices.splice(i,1);
                        }
                    }
                });

                // Get user gateways (true param specifies inclusion of devices)
                ownerService.getGateways($scope.skynetuuid, $scope.skynettoken, false, function(data) {
                    console.log('gateways', data);
                    $scope.editGatewaySection = false;
                    $scope.gateways = data.gateways;
                });

                // get api list, if showing api
                if($state.is('connector.channels.index')) {
                    channelService.getActive($scope.skynetuuid,function(data) {
                        $scope.activeChannels = data;
                    });
                    channelService.getAvailable($scope.skynetuuid,function(data) {
                        $scope.availableChannels = data;
                    });
                    // channelService.getCustomList($scope.skynetuuid, function(data) {
                    //     $scope.customchannelList = data;
                    // });
                }

                $scope.openNewApi = function() {
                    $state.go('connector.channels.editor', { name: 'new' });
                };

                $scope.openDetails = function (channel) {
                    // $scope.channel = channel;
                    $state.go('connector.channels.detail', { name: channel.name });
                };

                $scope.isActive = function (channel) {
                    if($scope.current_user.api) {
                        for(var l = 0; l<$scope.current_user.api.length; l++) {
                            if($scope.current_user.api[l].name===channel.name) {
                                return true;
                            }
                        }
                    }

                    return false;
                };

                $scope.isInactive = function (channel) {
                    if($scope.current_user.api) {
                        for(var l = 0; l<$scope.current_user.api.length; l++) {
                            if($scope.current_user.api[l].name===channel.name) {
                                return false;
                            }
                        }
                    }

                    return true;
                };

                $scope.getFAName = function (channel) {
                    var prefix = 'fa-';
                    var name = channel.name.toLowerCase();
                    if(name==='stackoverflow') { return prefix+'stack-overflow'; }
                    if(name==='vimeo') { return prefix+'vimeo-square'; }
                    if(name==='tumblr') { return prefix+'tumblr-square'; }
                    if(name==='fitbit') { return prefix+'square'; }
                    if(name==='twilio') { return prefix+'square'; }
                    if(name==='tropo') { return prefix+'square'; }
                    if(name==='rdio') { return prefix+'square'; }
                    if(name==='newyorktimes') { return prefix+'square'; }
                    if(name==='musixmatch') { return prefix+'square'; }
                    if(name==='lastfm') { return prefix+'square'; }
                    if(name==='etsy') { return prefix+'square'; }
                    if(name==='spotify') { return prefix+'square'; }
                    if(name==='delicious') { return prefix+'square'; }
                    if(name==='bitly') { return prefix+'square'; }
                    if(name==='readability') { return prefix+'square'; }
                    return prefix + name;
                };

                $scope.alert = function(alertContent){
                    alert(JSON.stringify(alertContent));
                };

                $scope.createDevice = function(){

                    if($scope.deviceName){

                        // var dupeFound = false;
                        // $scope.duplicateDevice = false;
                        var dupeUuid;
                        for (var i in $scope.devices) {
                            if($scope.devices[i].name == $scope.deviceName){
                                // dupeFound = true;
                                // $scope.duplicateDevice = true;
                                dupeUuid = $scope.devices[i].uuid;
                                dupeToken = $scope.devices[i].token;
                                dupeIndex = i;
                            }
                        }

                        formData = {};
                        formData.name = $scope.deviceName;
                        formData.keyvals = $scope.keys;

                        if(dupeUuid){

                            formData.uuid = dupeUuid;
                            formData.token = dupeToken;

                            deviceService.updateDevice($scope.skynetuuid, formData, function(data) {
                                try{
                                    $scope.devices.splice(dupeIndex,1);
                                    data.token = dupeToken;
                                    data.online = false;
                                    $scope.devices.push(data);
                                    $scope.deviceName = "";
                                    $scope.keys = [{}];
                                } catch(e){
                                    $scope.devices = [data];
                                }
                                $scope.addDevice = false;
                            });

                        } else {

                            deviceService.createDevice($scope.skynetuuid, formData, function(data) {
                                try{
                                    $scope.devices.push(data);
                                    $scope.deviceName = "";
                                    $scope.keys = [{}];
                                } catch(e){
                                    $scope.devices = [data];
                                }
                                $scope.addDevice = false;
                            });

                        }
                    }

                };

                $scope.editDevice = function( idx ){
                    $scope.addDevice = true;
                    var device_to_edit = $scope.devices[idx];
                    $scope.deviceName = device_to_edit.name;

                    // find additional keys to edit
                    var keys = [];
                    for (var key in device_to_edit) {
                        if (device_to_edit.hasOwnProperty(key)) {
                            if(key != "_id" && key != "name" && key != "online" && key != "owner" && key != "socketId" && key != "timestamp" && key != "uuid" && key != "token" && key != "$$hashKey" && key != "channel" && key != "eventCode"){
                                keys.push({"key": key, "value": device_to_edit[key]});
                            }
                        }
                    }
                    if(keys.length){
                        $scope.keys = keys;
                    } else {
                        $scope.keys = [{}];
                    }

                }

                $scope.deleteDevice = function( idx ){

                    confirmModal($modal, $scope, $log, 'Delete Device','Are you sure you want to delete this device?',
                        function() {
                            $log.info('ok clicked');
                            var device_to_delete = $scope.devices[idx];
                            deviceService.deleteDevice(device_to_delete.uuid, device_to_delete.token, function(data) {
                                $scope.devices.splice(idx, 1);
                            });
                        },
                        function() {
                            $log.info('cancel clicked');
                        });

                };

                $scope.keys = [{key:'', value:''}];
                $scope.addKeyVals = function() {
                    $scope.keys.push( {key:'', value:''} );
                }
                $scope.removeKeyVals = function(idx) {
                    // $scope.keys.push( {key:'', value:''} );
                    $scope.keys.splice(idx,1);
                }
                $scope.editGatewayCancel = function() {
                    $scope.editGatewaySection = false;
                }

                $scope.editGateway = function( idx ){
                    $scope.editGatewaySection = true;
                    var gateway_to_edit = $scope.gateways[idx];
                    $scope.gatewayName = gateway_to_edit.name;
                    $scope.editGatewayUuid = gateway_to_edit.uuid;

                    // find additional keys to edit
                    var keys = [];
                    for (var key in gateway_to_edit) {
                        if (gateway_to_edit.hasOwnProperty(key)) {
                            if(key != "_id" && key != "name" && key != "online" && key != "owner" && key != "socketId" && key != "timestamp" && key != "uuid" && key != "token" && key != "$$hashKey" && key != "channel" && key != "eventCode"){
                                keys.push({"key": key, "value": gateway_to_edit[key]});
                            }
                        }
                    }
                    if(keys.length){
                        $scope.keys = keys;
                    } else {
                        $scope.keys = [{}];
                    }

                }

                $scope.updateGateway = function(){
                    $scope.gatewayName = $('#gatewayName').val();
                    if($scope.gatewayName){

                        for (var i in $scope.gateways) {
                            if($scope.gateways[i].uuid == $scope.editGatewayUuid){
                                dupeUuid = $scope.gateways[i].uuid;
                                dupeToken = $scope.gateways[i].token;
                                dupeIndex = i;
                            }
                        }

                        formData = {};
                        formData.owner = $scope.skynetuuid;
                        formData.name = $scope.gatewayName;
                        formData.keyvals = $scope.keys;

                        formData.uuid = dupeUuid;
                        formData.token = dupeToken;

                        deviceService.updateDevice($scope.skynetuuid, formData, function(data) {
                            console.log(data);
                            try{
                                $scope.gateways.splice(dupeIndex,1);
                                data.token = dupeToken;
                                $scope.gateways.push(data);
                                $scope.gatewayName = "";
                                $scope.keys = [{}];
                            } catch(e){
                                $scope.gateways = [data];
                            }
                            $scope.editGatewaySection = false;
                        });


                    } else {
                        $scope.editGatewayUuid
                    }

                };

                $scope.deleteGateway = function( idx ){

                    confirmModal($modal, $scope, $log, 'Delete Gateway','Are you sure you want to delete this gateway?',
                        function() {
                            $log.info('ok clicked');
                            var gateway_to_delete = $scope.gateways[idx];
                            deviceService.deleteDevice(gateway_to_delete.uuid, gateway_to_delete.token, function(data) {
                                $scope.gateways.splice(idx, 1);
                            });
                        },
                        function() {
                            $log.info('cancel clicked');
                        });

                };

                $scope.deleteSubdevice = function(parent, idx){
                    confirmModal($modal, $scope, $log, 'Delete Subdevice','Are you sure you want to delete this subdevice?',
                        function() {
                            $log.info('ok clicked');
                            var subName = $scope.gateways[parent].subdevices[idx].name
                            $scope.gateways[parent].subdevices.splice(idx,1)
                            socket.emit('gatewayConfig', {
                                "uuid": $scope.gateways[parent].uuid,
                                "token": $scope.gateways[parent].token,
                                "method": "deleteSubdevice",
                                "name": subName
                                // "name": $scope.gateways[parent].subdevices[idx].name
                            }, function (deleteResult) {
                                // alert('subdevice deleted');
                            });
                        },
                        function() {
                            $log.info('cancel clicked');
                        });

                };

                $scope.addSubdevice = function(gateway, pluginName, subDeviceName, deviceProperties){

                    socket.emit('gatewayConfig', {
                        "uuid": gateway.uuid,
                        "token": gateway.token,
                        "method": "createSubdevice",
                        "type": pluginName,
                        "name": subDeviceName,
                        "options": deviceProperties
                    }, function (addResult) {
                        console.log(addResult);
                    });
                };

                $scope.updateSubdevice = function(gateway, pluginName, subDeviceName, deviceProperties){
                };

                $scope.deletePlugin = function(parent, idx){
                    confirmModal($modal, $scope, $log, 'Delete Plugin','Are you sure you want to delete this plugin?',
                        function() {
                            $log.info('ok clicked');
                            socket.emit('gatewayConfig', {
                                "uuid": $scope.gateways[parent].uuid,
                                "token": $scope.gateways[parent].token,
                                "method": "deletePlugin",
                                "name": $scope.gateways[parent].plugins[idx].name
                            }, function (deleteResult) {
                                alert('plugin deleted');
                            });
                        },
                        function() {
                            $log.info('cancel clicked');
                        });

                };

                $scope.addPlugin = function(gateway, pluginName){

                    socket.emit('gatewayConfig', {
                        "uuid": gateway.uuid,
                        "token": gateway.token,
                        "method": "installPlugin",
                        "name": pluginName
                    }, function (addResult) {
                        // alert('plugin added');
                        console.log(addResult);
                    });
                };

                $scope.openNewPlugin = function (gateway) {
                    console.log(gateway);
                    $scope.selectedGateway = gateway;

                    // http://npmsearch.com/query?fl=name,description,homepage&rows=200&sort=rating+desc&q=%22skynet-plugin%22
                    $http({
                        url: "http://npmsearch.com/query",
                        method: "get",
                        params: {
                            q: 'keywords:"skynet-plugin"',
                            // fields: 'name,keywords,rating,description,author,modified,homepage,version,license',
                            fields: 'name',
                            start: 0,
                            size: 100,
                            sort: 'rating:desc'
                        }
                    }).success(function(data, status, headers, config) {
                        console.log('npm search success',data);
                        $scope.plugins = data.results;

                        var modalInstance = $modal.open({
                            templateUrl: 'pluginModal.html',
                            scope: $scope,
                            controller: function ($modalInstance) {
                                $scope.ok = function (plugin) {
                                    $modalInstance.close({
                                        "plugin" : plugin.name
                                    });
                                };

                                $scope.cancel = function () {
                                    $modalInstance.dismiss('cancel');
                                };
                            }
                        });
                        modalInstance.result.then(function (response) {

                            $scope.plugin = response.plugin;
                            $scope.addPlugin($scope.selectedGateway, response.plugin);
                            if(!$scope.selectedGateway.plugins) $scope.selectedGateway.plugins = [];
                            $scope.selectedGateway.plugins.push({name: response.plugin})

                        }, function (){
                            $log.info('Modal dismissed at: ' + new Date());
                        });


                    }).error(function(data, status, headers, config) {
                        console.log('npm search failed',data);
                        $scope.status = status;
                        alert("Plugin search failed. Try again in a little while...")
                    });

                };

                $scope.openNewSubdevice = function (gateway) {
                    $scope.selectedGateway = gateway;

                    var modalInstance = $modal.open({
                        templateUrl: 'subDeviceModal.html',
                        scope: $scope,
                        controller: function ($modalInstance) {

                            $scope.gatewayName = $scope.selectedGateway.name;
                            $scope.plugins = $scope.selectedGateway.plugins;
                            $scope.ok = function (subDeviceName, plugin, deviceProperties) {

                                console.log("deviceProperties");
                                console.log(deviceProperties);
                                var properties = _.map(deviceProperties, function(deviceProperty){
                                    delete deviceProperty.$$hashKey;
                                    delete deviceProperty.type;
                                    delete deviceProperty.required;
                                    return deviceProperty;
                                });

                                var options = {};
                                _.forEach(deviceProperties, function(property){
                                    options[property.name] = property.value;
                                });

                                $modalInstance.close({
                                    "name" : subDeviceName,
                                    "plugin" : plugin.name,
                                    "deviceProperties" : options
                                });
                            };

                            $scope.cancel = function () {
                                $modalInstance.dismiss('cancel');
                            };

                            $scope.getSchema = function (plugin){
                                $log.info(plugin);
                                $scope.schema = plugin.optionsSchema;
                                var keys = _.keys($scope.schema.properties);

                                var propertyValues = _.values($scope.schema.properties);
                                console.log('propertyValues');
                                console.log(propertyValues);

                                var deviceProperties = _.map(keys, function(propertyKey){
                                    console.log(propertyKey);
                                    var propertyValue = $scope.schema.properties[propertyKey];
                                    console.log(propertyValue);
                                    var deviceProperty = {};
                                    deviceProperty.name = propertyKey;
                                    deviceProperty.type = propertyValue.type;
                                    deviceProperty.required = propertyValue.required;
                                    deviceProperty.value = "";
                                    return deviceProperty;
                                });
                                console.log(deviceProperties);
                                $scope.deviceProperties = deviceProperties;
                            };
                        }
                    });

                    modalInstance.result.then(function (response) {

                        $scope.subDeviceName = response.name;
                        $scope.plugin = response.plugin;
                        $scope.deviceProperties = response.deviceProperties;
                        $scope.addSubdevice($scope.selectedGateway, response.plugin, response.name, response.deviceProperties);

                        $scope.selectedGateway.subdevices.push({name: response.name, type: response.plugin, options: response.deviceProperties})

                    }, function (){
                        $log.info('Modal dismissed at: ' + new Date());
                    });

                };


                $scope.openEditSubdevice = function (gateway, subdevice) {
                    $scope.selectedGateway = gateway;
                    $scope.selectedSubdevice = subdevice;
                    for(var l=0;l<$scope.selectedGateway.plugins.length;l++) {
                        if($scope.selectedGateway.plugins[l].name===subdevice.type) {
                            $scope.selectedPlugin = $scope.selectedGateway.plugins[l];
                            break;
                        }
                    }
                    $scope._backup = angular.copy(subdevice);

                    var modalInstance = $modal.open({
                        templateUrl: 'editSubDeviceModal.html',
                        scope: $scope,
                        controller: function ($modalInstance) {
                            // $log.info($scope.selectedSubdevice);
                            $scope.gatewayName = $scope.selectedGateway.name;
                            $scope.plugins = $scope.selectedGateway.plugins;
                            $scope.ok = function (subDeviceName, plugin, deviceProperties) {
                                $scope._backup = false;

                                var properties = _.map(deviceProperties, function(deviceProperty){
                                    delete deviceProperty.$$hashKey;
                                    delete deviceProperty.type;
                                    delete deviceProperty.required;
                                    return deviceProperty;
                                });

                                var options = {};
                                _.forEach(deviceProperties, function(property){
                                    options[property.name] = property.value;
                                });

                                $modalInstance.close({
                                    "name" : subDeviceName,
                                    "plugin" : $scope.selectedSubdevice.type,
                                    "deviceProperties" : options
                                });
                            };

                            $scope.cancel = function () {
                                $modalInstance.dismiss('cancel');
                            };

                            $scope.getSchema = function (plugin){
                                $scope.schema = plugin.optionsSchema;
                                // $log.info($scope.plugins);
                                var keys = _.keys($scope.schema.properties);
                                var propertyValues = _.values($scope.schema.properties);

                                var deviceProperties = _.map(keys, function(propertyKey){
                                    var propertyValue = $scope.schema.properties[propertyKey];
                                    var deviceProperty = {};
                                    deviceProperty.name = propertyKey;
                                    deviceProperty.type = propertyValue.type;
                                    deviceProperty.required = propertyValue.required;
                                    deviceProperty.value = "";
                                    return deviceProperty;
                                });
                                $scope.deviceProperties = deviceProperties;
                            };

                            $scope.getSchema($scope.selectedPlugin);
                        }
                    });

                    modalInstance.result.then(function (response) {
                        $scope.subDeviceName = response.name;
                        $scope.plugin = response.plugin;
                        $scope.deviceProperties = response.deviceProperties;
                        $scope.updateSubdevice($scope.selectedGateway, response.plugin, response.name, response.deviceProperties);
                        // TODO: update the subdevice, not push a new one
                        // $scope.selectedGateway.subdevices.push({name: response.name, type: response.plugin, options: response.deviceProperties})

                    }, function (){
                        $log.info('Modal dismissed at: ' + new Date());
                        if($scope._backup) {
                            // $scope.selectedSubdevice.name = $scope._backup.name;
                            for(var l=0; l<=$scope.selectedGateway.subdevices.length; l++) {
                                if($scope.selectedGateway.subdevices[l] == $scope.selectedSubdevice) {
                                    $log.info('found match');
                                    $scope.selectedGateway.subdevices[l] = $scope._backup;
                                }
                            }
                        }
                    });

                }

            }); //end skynet.js

        });

    })
    .controller('devtoolsController', function($scope, $http, $injector, $location, $modal, $log, $q, $modal, $state,
                                                ownerService, deviceService, channelService) {
        $scope.skynetStatus = false;
        $scope.channelList = [];
        $scope.predicate = 'name';

        checkLogin($scope, $http, $injector, true, function(){
            $scope.navType = 'pills';

            // connect to skynet
            var skynetConfig = {
                "uuid": $scope.skynetuuid,
                "token": $scope.skynettoken
            };

            skynet(skynetConfig, function (e, socket) {
                if (e) throw e;

                channelService.getCustomList($scope.skynetuuid, function(data) {
                  $log.info(data);
                  $scope.customchannelList = data;
                });

                $scope.openNewApi = function() { $state.go('connector.channels.editor', { name: 'new' }); };
                $scope.openDetails = function (channel) { $state.go('connector.channels.detail', { name: channel.name }); };

                $scope.isActive = function (channel) {
                    if($scope.current_user.api) {
                        for(var l = 0; l<$scope.current_user.api.length; l++) {
                            if($scope.current_user.api[l].name===channel.name) {return true;}
                        }
                    }
                    return false;
                };

                $scope.isInactive = function (channel) {
                    if($scope.current_user.api) {
                        for(var l = 0; l<$scope.current_user.api.length; l++) {
                            if($scope.current_user.api[l].name===channel.name) {return false;}
                        }
                    }
                    return true;
                };

            }); //end skynet.js

        });

    })
    .controller('apiController', function($scope, $http, $injector, $location, $stateParams, $modal, $log, $state,
                                          channelService, userService) {

        $scope.skynetStatus = false;
        $scope.channel = {};
        $scope.user_channel = {};
        $scope.has_user_channel = false;
        $scope.custom_tokens = {};

        checkLogin($scope, $http, $injector, true, function(){
//            $("#nav-connector").addClass('active');
//            $("#main-nav").show();
//            $("#main-nav-bg").show();

            channelService.getByName($stateParams.name, function(data) {

                $scope.channel = data;
                $scope.custom_tokens = data.custom_tokens;

                for(var l = 0; l<$scope.current_user.api.length; l++) {
                    if($scope.current_user.api[l].name===$scope.channel.name) {
                        $scope.user_channel = $scope.current_user.api[l];

                        if($scope.current_user.api[l].custom_tokens)
                            $scope.custom_tokens = $scope.current_user.api[l].custom_tokens;
                        $scope.has_user_channel = true;
                    }
                }
            });

            $scope.editCustom = function() {
                $state.go('connector.channels.editor', { name: $scope.channel.name });
            };

            $scope.open = function () {

                var modalInstance = $modal.open({
                    templateUrl: 'myModalContent.html',
                    controller: function ($scope, $modalInstance) {

                        $scope.ok = function () {
                            $modalInstance.close('ok');
                        };

                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };
                    },
                    resolve: { }
                });

                modalInstance.result.then(function (response) {
                    if(response==='ok') {
                        $log.info('clicked ok');

                        userService.removeConnection($scope.skynetuuid, $scope.channel.name, function(data) {

                            $scope.has_user_channel = false;

                        });

                    };
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            $scope.setDeactivate = function() {
                if($scope.isOAuth()) {
                    $scope.open();
                    return;
                }

                $scope.has_user_channel = false;
            };

            $scope.isActivated = function() {
                // return false;
                return $scope.has_user_channel;
            };

            $scope.isOAuth = function() {
                if($scope.channel && $scope.channel.auth_strategy==='oauth') {
                    return true;
                }

                return false;
            };

            $scope.isSimpleAuth = function() {
                if($scope.channel && $scope.channel.auth_strategy==='simple') {
                    return true;
                }

                return false;

            };

            $scope.isCustomAuth = function() {
                if($scope.channel && $scope.channel.auth_strategy==='custom') {
                    return true;
                }

                return false;

            };

            $scope.isNoAuth = function() {
                if($scope.channel && $scope.channel.auth_strategy==='none') {
                    return true;
                }

                return false;

            };

            $scope.hideSecretField = function() {
                if(!$scope.channel) return false;
                if($scope.channel.name==='MusixMatch') {
                    return true;
                }

                return false;
            }

            $scope.save = function() {
                if(!$scope.channel) return;

                userService.saveConnection($scope.skynetuuid, $scope.channel.name, $scope.key, $scope.token, $scope.custom_tokens,
                    function(data) {
                        console.log('saved');
                        $scope.has_user_channel = true;
                    });

                return;

            };

            $scope.authorize = function (channel) {
              if(channel.owner || channel.useCustom) {
                var loc = '/api/auth/' + channel.name + '/custom';
              } else {
                var loc = '/api/auth/' + channel.name;
              }
              // $log.info(loc);
              location.href = loc;
            };

            $scope.logo_url = function() {
                if(!$scope.channel || !$scope.channel.logo) return '';

                return $scope.channel.logo;
            };

        });

    })
    .controller('apieditorController', function($rootScope, $scope, $http, $injector, $location, $stateParams, $modal, $log, $state,
                                                channelService, userService) {

        $scope.skynetStatus = false;
        $scope.isEdit = false;
        $scope.isNew = false;

        $scope.channel = {
            owner: '',
            auth_strategy: '',
            logo: '',
            name: '',
            description: '',
            documentation: '',
            enabled: true,
            application: {
                base: '',
                resources: [],
            }
        };

        $scope.setEditMode = function() {$scope.isEdit = true;};
        $scope.cancelEdit = function() {$scope.isEdit = false;};
        $scope.showEditResouce = function(path) {return $scope.editPath===path;};
        $scope.setEditResource = function(path) {$scope.editPath=path;};

        $scope.addResource = function() {
            if(!$scope.channel) return;
            if(!$scope.channel.application) {$scope.channel.application = {};}
            if(!$scope.channel.application.resources) {$scope.channel.application.resources = [];}
            var newResource = { httpMethod: 'none', doc: {}, authentication: {} };
            $scope.channel.application.resources.push(newResource);
            $scope.openEditResource(newResource);
        };

        $scope.save = function() {
            $scope.isEdit = false;
            // console.log($scope.channel);
            if(!$scope.channel) return;

            channelService.save($scope.channel, function(data){
                // $log.info('completed save call............');
                if(data) {
                    $scope.channel = data;
                    $scope.isEdit = false;
                    $state.go('connector.channels.editor', { name: data.name });
                }
            });

        };

        $scope.authorize = function (channel) {
            //$location.path( '/api/auth/' + channel.name );
            // if(channel.oauth && channel.oauth.version) {
            //   location.href = '/api/auth/' + channel.name + '/custom';
            // } else {
              location.href = '/api/auth/' + channel.name;
            // }
        };

        $scope.logo_url = function() {
            if(!$scope.channel || !$scope.channel.logo) return '';

            return $scope.channel.logo;
        };

        $scope.confirmDeleteResource = function(index) {
            $scope.selectedResourceIndex = index;
            var modalInstance = $modal.open({
                templateUrl: 'confirmDeleteResource.html',
                scope: $scope,
                controller: function ($modalInstance) {

                    $scope.ok = function () {
                        if($scope.selectedResourceIndex >= $scope.channel.application.resources.length) {
                            $modalInstance.dismiss('ok');
                            return;
                        }

                        $scope.channel.application.resources.splice($scope.selectedResourceIndex,1);
                        channelService.save($scope.channel, function(data){
                            if(data) { $modalInstance.dismiss('ok'); }
                        });
                        // $modalInstance.dismiss('ok');
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }
            });

            modalInstance.result.then(function (response) {
                    if(response==='ok') {
                        $log.info('clicked ok');
                    }
                },
                function (){
                    $log.info('Modal dismissed at: ' + new Date());
                    $scope.selectedResourceIndex = null;
                });

        };

        $scope.openEditResource = function (resource) {
            $scope.selectedResource = resource;
            $scope._backup = angular.copy(resource);
            var modalInstance = $modal.open({
                templateUrl: 'editResource.html',
                scope: $scope,
                controller: function ($modalInstance) {

                    $scope.addParam = function() {
                        if(!$scope.selectedResource.params) $scope.selectedResource.params = [];
                        $scope.selectedResource.params.push({name: '', style: '', type: 'string', value: '', required: "false"});
                    };
                    $scope.removeParam = function(index){
                        if(!$scope.selectedResource.params) $scope.selectedResource.params = [];
                        console.log('length = ' + $scope.selectedResource.params.length);
                        //remove all null items
                        for(var l=$scope.selectedResource.params.length-1; l>=0 ;l--) {
                            console.log('index = ' + l);
                            console.log($scope.selectedResource.params[l]==null);
                            if($scope.selectedResource.params[l]==null) $scope.selectedResource.params.splice(l,1);
                        }
                        if(index>=$scope.selectedResource.params.length) return;
                        $scope.selectedResource.params.splice(index,1);
                    };

                    $scope.ok = function () {
                        // $scope.channel.application.resources.push($scope.selectedResource);
                        channelService.save($scope.channel, function(data){
                            // $log.info('completed save call............');
                            if(data) {
                                $modalInstance.dismiss('ok');
                            }
                        });

                    };

                    $scope.cancel = function () {
                        $scope.selectedResource.path = $scope._backup.path;
                        $scope.selectedResource.displayName = $scope._backup.displayName;
                        $scope.selectedResource.doc.url = $scope._backup.doc.url;
                        $scope.selectedResource.doc.t = $scope._backup.doc.t;
                        $scope.selectedResource.curl = $scope._backup.curl;
                        if($scope._backup.authentication) {
                            $scope.selectedResource.authentication.required = $scope._backup.authentication.required;
                        }
                        $scope.selectedResource.httpMethod = $scope._backup.httpMethod;

                        $modalInstance.dismiss('cancel');
                    };

                    $scope.getSchema = function (plugin) {
                    };
                }
            });

            modalInstance.result.then(function (response) {
                    if(response==='ok') {
                        $log.info('clicked ok');
                    } else if (response==='cancel') {
                        $log.info('clicked cancel');
                        // resource = $scope.selectedResource;
                    }
                },
                function (){
                    $log.info('Modal dismissed at: ' + new Date());
                    resource = $scope.selectedResource;
                });
        };

        checkLogin($rootScope, $http, $injector, true, function(){
//            $("#nav-connector").addClass('active');
//            $("#main-nav").show();
//            $("#main-nav-bg").show();

//            $scope.$apply(function(){

                if($stateParams.name == 'new') {
                    $scope.isNew = true;
                    $scope.channel.owner = $scope.skynetuuid;
                } else {
                    channelService.getByName($stateParams.name, function(data) {
                        $scope.isNew = false;
                        $scope.channel = data;
                    });
                }
//            });

        });

    })
    .controller('apiresourcesController', function($scope, $http, $injector, $location, $stateParams, $modal, $log,
                                                   channelService, userService) {

        $scope.skynetStatus = false;
        $scope.channel = {};
        $scope.user_channel = {};
        $scope.has_user_channel = false;
        $scope.custom_tokens = {};

        checkLogin($scope, $http, $injector, true, function(){
            $("#nav-connector").addClass('active');
            $("#main-nav").show();
            $("#main-nav-bg").show();

            channelService.getByName($stateParams.name, function(data) {

                $scope.channel = data;
                $scope.custom_tokens = data.custom_tokens;

                for(var l = 0; l<$scope.current_user.api.length; l++) {
                    if($scope.current_user.api[l].name===$scope.channel.name) {
                        $scope.user_channel = $scope.current_user.api[l];

                        if($scope.current_user.api[l].custom_tokens)
                            $scope.custom_tokens = $scope.current_user.api[l].custom_tokens;
                        $scope.has_user_channel = true;
                    }
                }
            });

            $scope.editor = function () {

                var modalInstance = $modal.open({
                    templateUrl: 'myModalContent.html',
                    controller: function ($scope, $modalInstance) {
                        $scope.skynetStatus = false;

                        $scope.ok = function () {
                            $modalInstance.close('ok');
                        };

                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };
                    },
                    resolve: { }
                });

                modalInstance.result.then(function (response) {
                    if(response==='ok') {
                        $log.info('clicked ok');

                        userService.removeConnection($scope.skynetuuid, $scope.channel.name, function(data) {

                            $scope.has_user_channel = false;

                        });

                    };
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            $scope.save = function() {
                if(!$scope.channel) return;

                // userService.saveConnection($scope.skynetuuid, $scope.channel.name, $scope.key, $scope.token, $scope.custom_tokens,
                //   function(data) {
                //     console.log('saved');
                //     $scope.has_user_channel = true;
                //   });

                return;

            };

            $scope.authorize = function (channel) {
                //$location.path( '/api/auth/' + channel.name );
                var loc = '/api/auth/' + channel.name;
                console.log(loc);
                location.href = loc;
            };

            $scope.logo_url = function() {
                if(!$scope.channel || !$scope.channel.logo) return '';

                return $scope.channel.logo;
            };

        });

    })
    .controller('apiresourcedetailController', function($scope, $http, $injector, $location, $stateParams, $modal, $log,
                                                        channelService, userService) {

        $scope.skynetStatus = false;
        $scope.channel = {};
        $scope.user_channel = {};
        $scope.has_user_channel = false;
        $scope.custom_tokens = {};

        checkLogin($scope, $http, $injector, true, function(){
            $("#nav-connector").addClass('active');
            $("#main-nav").show();
            $("#main-nav-bg").show();

            channelService.getByName($stateParams.name, function(data) {

                $scope.channel = data;
                $scope.custom_tokens = data.custom_tokens;

                for(var l = 0; l<$scope.current_user.api.length; l++) {
                    if($scope.current_user.api[l].name===$scope.channel.name) {
                        $scope.user_channel = $scope.current_user.api[l];

                        if($scope.current_user.api[l].custom_tokens)
                            $scope.custom_tokens = $scope.current_user.api[l].custom_tokens;
                        $scope.has_user_channel = true;
                    }
                }
            });

            $scope.editor = function () {

                var modalInstance = $modal.open({
                    templateUrl: 'myModalContent.html',
                    controller: function ($scope, $modalInstance) {

                        $scope.ok = function () {
                            $modalInstance.close('ok');
                        };

                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };
                    },
                    resolve: { }
                });

                modalInstance.result.then(function (response) {
                    if(response==='ok') {
                        $log.info('clicked ok');

                        userService.removeConnection($scope.skynetuuid, $scope.channel.name, function(data) {

                            $scope.has_user_channel = false;

                        });

                    };
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            $scope.save = function() {
                if(!$scope.channel) return;

                // userService.saveConnection($scope.skynetuuid, $scope.channel.name, $scope.key, $scope.token, $scope.custom_tokens,
                //   function(data) {
                //     console.log('saved');
                //     $scope.has_user_channel = true;
                //   });

                return;

            };

            $scope.authorize = function (channel) {
                //$location.path( '/api/auth/' + channel.name );
                var loc = '/api/auth/' + channel.name;
                console.log(loc);
                location.href = loc;
            };

            $scope.logo_url = function() {
                if(!$scope.channel || !$scope.channel.logo) return '';

                return $scope.channel.logo;
            };

        });

    })
    .controller('designerController', function($scope, $http, $injector, $location, nodeRedService) {

        checkLogin($scope, $http, $injector, true, function(){
//    $(".active").removeClass();
//    $("#nav-designer").addClass('active');
//    $("#main-nav").show();
//    $("#main-nav-bg").show();
            // $(document).trigger("nav-close");

            // Get NodeRed port number
            nodeRedService.getPort($scope.skynetuuid, $scope.skynettoken, function(data) {
                $scope.redPort = data.replace(/["']/g, "");
                $scope.redFrame = "http://" + $scope.skynetuuid + ":" + $scope.skynettoken + "@designer.octoblu.com:" + $scope.redPort;

                $scope.designerFrame = {
                    skynetid: $scope.skynetuuid,
                    skynettoken: $scope.skynettoken
                };
            });

        });

    })
    .controller('analyzerController', function($scope, $http, $injector, $location) {
        checkLogin($scope, $http, $injector, true, function(){
//    $(".active").removeClass();
//    $("#nav-analyzer").addClass('active');
//    $("#main-nav").show();
//    $("#main-nav-bg").show();

            $scope.splunkFrame = "http://54.203.249.138:8000?output=embed";

        });
    })
    .controller('gatewayController', function($scope, $http, $injector, $location, deviceService) {
        checkLogin($scope, $http, $injector, false, function(){
//    $(".active").removeClass();
//    $("#nav-connector").addClass('active');
//    $("#main-nav").show();
//    $("#main-nav-bg").show();

            deviceService.getDevice($location.search().uuid, function(data) {
                try{
                    $scope.gatewayFrame = "http://" + data.localhost + ":" + data.port;
                } catch(e){
                    $scope.gatewayFrame = "";
                }
            });

        });
    });

function checkLogin($scope, $http, $injector, secured, cb) {
    //googleAnalytics();
    user = $.cookie("skynetuuid");
    if(user == undefined || user == null){
        if (secured){
            window.location.href = "/login";
        }

    } else {

        var userService = $injector.get('userService');
        userService.getUser(user, function(data) {

            $scope.user_id = data._id;
            $scope.current_user = data;

            $(".auth").hide();
            $(".user-menu").show();
            $(".toggle-nav").show();
            $(".navbar-brand").attr("href", "/dashboard");

            if (data.local) {
                $(".avatar").html('<img width="23" height="23" src="http://avatars.io/email/' + data.local.email.toString() + '" />' );
                $(".user-name").html(data.local.email.toString());
                $scope.user = data.local.email;
                $scope.skynetuuid = data.local.skynetuuid;
                $scope.skynettoken = data.local.skynettoken;
                token = data.local.skynettoken;

            } else if (data.twitter) {
                $(".user-name").html('@' + data.twitter.username.toString());
                $scope.user = data.twitter.displayName;
                $scope.skynetuuid = data.twitter.skynetuuid;
                $scope.skynettoken = data.twitter.skynettoken;
                token = data.twitter.skynettoken;

            } else if (data.facebook) {
                $(".avatar").html('<img width="23" height="23" alt="' + data.facebook.name.toString() + '" src="https://graph.facebook.com/' + data.facebook.id.toString() + '/picture" />' );
                $(".user-name").html(data.facebook.name.toString());
                $scope.user = data.facebook.name;
                $scope.skynetuuid = data.facebook.skynetuuid;
                $scope.skynettoken = data.facebook.skynettoken;
                token = data.facebook.skynettoken;

            } else if (data.google) {
                $(".avatar").html('<img width="23" height="23" alt="' + data.google.name.toString() + '" src="https://plus.google.com/s2/photos/profile/' + data.google.id.toString() + '?sz=32" />' );
                $(".user-name").html('+' + data.google.name.toString());
                $scope.user = data.google.name;
                $scope.skynetuuid = data.google.skynetuuid;
                $scope.skynettoken = data.google.skynettoken;
                token = data.google.skynettoken;

            } else {
                // $scope.user = data.local.email;
                $scope.skynetuuid = user;
            }
            // window.location.href = "/dashboard";
            cb();

        });

    }

//  function googleAnalytics(){
//    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
//    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
//    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
//    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
//
//    ga('create', 'UA-2483685-30', 'octoblu.com');
//    ga('send', 'pageview');
//  }

}

var confirmModal = function($modal, $scope, $log, title, message, okFN, cancelFN) {
    var modalHtml = '<div class="modal-header">';
    modalHtml += '<h3>' + title + '</h3>';
    modalHtml += '</div>';
    modalHtml += '<div class="modal-body">';
    modalHtml += message;
    modalHtml += '</div>';
    modalHtml += '<div class="modal-footer">';
    modalHtml += '<button class="btn btn-primary" ng-click="ok()">OK</button>';
    modalHtml += '<button class="btn" ng-click="cancel()">Cancel</button>';
    modalHtml += '</div>';

    var modalInstance = $modal.open({
        template: modalHtml, scope: $scope,
        controller: function ($modalInstance) {
            $scope.ok = function () { $modalInstance.dismiss('ok'); if(okFN) {okFN();} };
            $scope.cancel = function () { $modalInstance.dismiss('cancel'); if(cancelFN) {cancelFN();} };
        }
    });

    modalInstance.result.then(
        function (response) { if(response==='ok') { $log.info('clicked ok'); } },
        function () { $log.info('Modal dismissed at: ' + new Date()); }
    );
};
