e2eApp.controller('mainController', function($scope, $location) {
  $("#main-nav").hide();
  user = $.cookie("skynetuuid");
  if(user != undefined ){
    window.location.href = "/dashboard";
  } else {  
    $scope.message = 'Home page content pending.';
  }

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
        athenaLoopTime = 5000
      );
    });
  });

 $(window).load(function () {
   /*GALLERY*/
   apolloGallery(
     /*gallery-opened*/
     apolloGalleryOverlayId = 'gallery-overlay',
     apolloGalleryDestinationId = 'gallery-destination',
     apolloGalleryPreviousId = 'gallery-previous',
     apolloGalleryNextId = 'gallery-next',
     apolloGalleryCloseId = 'gallery-close',
     apolloGalleryMoreId = 'gallery-more',
     apolloGalleryLoadingId = 'gallery-loading',
     /*gallery-menu*/
     apolloGalleryMenuId = 'isotope_filters',
     /*gallery-closed*/
     apolloGalleryId = 'isotope_container',
     apolloGalleryItemsClasses = 'gallery-item',
     apolloGalleryCoverClasses = 'gallery-cover',
     apolloGalleryDescriptionClasses = 'gallery-description',      
     apolloGalleryExpandClasses = 'gallery-expand',
     apolloGalleryDestinationTextClass = 'gallery-text'
   );
   /*MAIN MENU*/
   hermesMenu(
     hermesMenuId = 'mainmenu',
     hermesBarId = 'mainmenubar',
     hermesSynchroScroll = true,
     hermesExceptionClass = 'nobar'
   );
   /*ACCORDION MENU*/
   hermesMenu(
     hermesMenuId = 'navtabs_menu',
     hermesBarId = 'navtabs_menubar',      
     hermesSynchroScroll = false,
     hermesLinkColor = 'white'
   );
   /*GALLERY MENU*/
   hermesMenu(
     hermesMenuId = 'isotope_filters',
     hermesBarId = 'isotope_filtersbar',     
     hermesSynchroScroll = false,
     hermesLinkColor = 'white'
   );
   /*ISOTOPE*/
   if ($('#isotope_container').length){
     var $container = $('#isotope_container');
     $container.isotope({
        duration: 750,
        easing: 'linear',
        queue: false,
        layoutMode : 'masonry'
     });
   }
   $('#isotope_filters a').click(function(){
     //DYNAMIC MENU LABEL
     var selector = $(this).attr('data-filter');
     $container.isotope({ filter: selector });
     return false;
   });
   /*CLASS TICKET*/
   var t_current = $('.ticket');
   var t_number = t_current.length;
   var t_counter = 0;
   $('.ticket-button').click(function(){
     current = $(this);
     if (current.hasClass('ticket-right')) {
       t_current.eq(t_counter).stop().fadeOut(300);
       if (t_counter < t_number-1) {
         t_counter++;
       }
       else {
         t_counter = 0;
       }
       t_current.eq(t_counter).stop().delay(300).fadeIn(300);
     }
     else {
       t_current.eq(t_counter).stop().fadeOut(300);
       if (t_counter < t_number-1) {
         t_counter--;
       }
       else {
         t_counter = t_number-1;
       }
       t_current.eq(t_counter).stop().delay(300).fadeIn(300);
     }

   });
   $(window).resize(function() {
     if($(window).width() > 992) {
     t_current.css({display: ''});
     }
     else {
     t_current.css({display: ''});
     t_current.eq(0).show();
     }
     t_counter = 0;
   });
   /*SKILLS*/
   $('#skills').find('.progress-bar').css({width: 0});
   var s_windowHeight = $(window).height()*0.5;
   var s_target = $('#skills').offset().top;
   $(window).scroll(function(){
     var s_scrollHeight = $(window).scrollTop()+s_windowHeight;
     if (s_scrollHeight > s_target) {
       $('#skills').find('.progress-bar').each(function() {
         var current = $(this);
         var s_final = current.data('final');
         current.stop().animate({width: s_final+'%'},1000);
       });
     }
   });

 });//END LOAD

});

e2eApp.controller('aboutController', function($scope, $http) {
  $scope.message = 'About page content pending.';
  checkLogin($scope, $http, false, function(){});  

});

e2eApp.controller('contactController', function($scope, $http) {
  $scope.message = 'Contact page content pending.';
  checkLogin($scope, $http, false, function(){});  

});

e2eApp.controller('signupController', function($scope, $location) {
});


e2eApp.controller('loginController', function($scope, $http) {
  console.log('login');
  user = $.cookie("skynetuuid");
  console.log(user);
  if (user != undefined){
    window.location.href = "/dashboard";
  }
});

e2eApp.controller('profileController', function($scope, $http, $location) {
  checkLogin($scope, $http, false, function(){
    $(".active").removeClass();
    $("#main-nav").show();
    $("#main-nav-bg").show();

  });  
});

e2eApp.controller('servicesController', function($scope, $http, $location) {
  checkLogin($scope, $http, false, function(){
    $(".active").removeClass();
    $("#main-nav").show();
    $("#main-nav-bg").show();

  });  
});

e2eApp.controller('docsController', function($scope, $http, $location) {
  checkLogin($scope, $http, false, function(){
    $(".active").removeClass();
    $("#nav-resources").addClass('active');
    $("#main-nav").show();
    $("#main-nav-bg").show();

  });  
});

e2eApp.controller('faqsController', function($scope, $http, $location) {
  checkLogin($scope, $http, false, function(){
    $(".active").removeClass();
    $("#nav-resources").addClass('active');
    $("#main-nav").show();
    $("#main-nav-bg").show();

  });  
});

e2eApp.controller('pricingController', function($scope, $http, $location) {
  checkLogin($scope, $http, false, function(){
    $(".active").removeClass();
    $("#nav-resources").addClass('active');
    $("#main-nav").show();
    $("#main-nav-bg").show();

  });  
});

e2eApp.controller('dashboardController', function($scope, $http, $location, ownerService) {
  $scope.message = 'Contact page content pending.';
  checkLogin($scope, $http, false, function(){
    $(".active").removeClass();
    $("#nav-dashboard").addClass('active');
    $("#main-nav").show();
    $("#main-nav-bg").show();

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
});

e2eApp.controller('controllerController', function($scope, $http, $location, ownerService, messageService) {
  checkLogin($scope, $http, false, function(){
    $(".active").removeClass();
    $("#nav-controller").addClass('active');
    $("#main-nav").show();
    $("#main-nav-bg").show();

    // Get user devices
    ownerService.getDevices($scope.skynetuuid, $scope.skynettoken, function(data) {
      $scope.devices = data.devices;
    });

    // connect to skynet
    var skynetConfig = {
      "uuid": $scope.skynetuuid,
      "token": $scope.skynettoken
    }    
    skynet(skynetConfig, function (e, socket) {
      if (e) throw e

      // socket.emit('subscribe', {
      //   "uuid": data.devices[i].uuid,
      //   "token": data.devices[i].token
      // }, function (data) {
      //   // console.log(data); 
      // });

      $scope.sendMessage = function(){

        if($scope.sendUuid == undefined || $scope.sendUuid == ""){
          if($scope.device){
            var uuid = $scope.device.uuid;
          } else {
            var uuid = "";
          }
        } else {
          var uuid = $scope.sendUuid;
        }

        if(uuid){
          // messageService.sendMessage(uuid, $scope.sendText, function(data) {
          //   $scope.messageOutput = data;
          // });
          // console.log($scope.sendText);
          socket.emit('message', {
            "devices": uuid,
            "message": $scope.sendText
          }, function(data){
            console.log(data); 
          });     
          $scope.messageOutput = "Message Sent: " + $scope.sendText;      

        }
      }


    });

    // $scope.sendMessage = function(){

    //   if($scope.sendUuid == undefined || $scope.sendUuid == ""){
    //     if($scope.device){
    //       var uuid = $scope.device.uuid;
    //     } else {
    //       var uuid = "";
    //     }
    //   } else {
    //     var uuid = $scope.sendUuid;
    //   }

    //   if(uuid){
    //     messageService.sendMessage(uuid, $scope.sendText, function(data) {
    //       $scope.messageOutput = data;
    //     });

    //   }
    // }

  });  
});

e2eApp.controller('adminController', function($scope, $http, $location) {
  checkLogin($scope, $http, false, function(){
    $(".active").removeClass();
    $("#nav-admin").addClass('active');
    $("#main-nav").show();
    $("#main-nav-bg").show();

  });  
});

e2eApp.controller('connectorController', function($scope, $http, $location, $modal, $log, $q, $modal,
      ownerService, deviceService, channelService) {
  $scope.skynetStatus = false;
  $scope.channelList = [];
  $scope.predicate = 'name';

  checkLogin($scope, $http, true, function(){
    $(".active").removeClass();
    $("#nav-connector").addClass('active');
    $("#main-nav").show();
    $("#main-nav-bg").show();
    
    if($location.$$path == "/connector" || $location.$$path == "/devices") {
      $scope.activeTab = 'devices';
      $("#devices").addClass('active');
    } else if($location.$$path == "/gateways") {
      $scope.activeTab = 'gateways';
    } else if($location.$$path == "/apis") {
      $scope.activeTab = 'apis';
    } else if($location.$$path == "/people") {
      $scope.activeTab = 'people';
    } else if($location.$$path == "/tools") {
      $scope.activeTab = 'devtools';
    }
    
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

      // Get user gateways
      ownerService.getGateways($scope.skynetuuid, $scope.skynettoken, function(data) {
        console.log('gateways', data);
        $scope.editGatewaySection = false;
        $scope.gateways = data.gateways;
      });

      // get api list, if showing api
      if($scope.activeTab == 'apis') {
        channelService.getList(function(data) {
          $scope.channelList = data;
        });
      }

      $scope.openNewApi = function() {
        $location.path( '/apieditor/new' );
      };

      $scope.openDetails = function (channel) {
        // $scope.channel = channel;
        $location.path( '/apis/' + channel.name );
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

        var device_to_delete = $scope.devices[idx];
        deviceService.deleteDevice(device_to_delete.uuid, device_to_delete.token, function(data) { 
          $scope.devices.splice(idx, 1);
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

        var gateway_to_delete = $scope.gateways[idx];
        deviceService.deleteDevice(gateway_to_delete.uuid, gateway_to_delete.token, function(data) { 
          $scope.gateways.splice(idx, 1);
        });
        
      };

      $scope.deleteSubdevice = function(parent, idx){
        socket.emit('gatewayConfig', {
          "uuid": $scope.gateways[parent].uuid,
          "token": $scope.gateways[parent].token,
          "method": "deleteSubdevice",
          "name": $scope.gateways[parent].subdevices.value[idx].name
        }, function (deleteResult) {
          alert('subdevice deleted');
        });
      };    

      $scope.addSubdevice = function(gateway, pluginName, subDeviceName, deviceProperties){

        socket.emit('gatewayConfig', {
          "uuid": gateway.uuid,
          "token": gateway.token,
          "method": "createSubdevice",
          // "type": "skynet-greeting",
          // "name": "mygreeting",
          // "options": {greetingPrefix: "hello"}
          "type": pluginName,
          "name": subDeviceName,
          "options": deviceProperties
        }, function (addResult) {
          // gateways[n].plugins = plugins.result;
          alert('subdevice added');
          console.log(addResult);
        });
      };    


      $scope.deletePlugin = function(parent, idx){
        socket.emit('gatewayConfig', {
          "uuid": $scope.gateways[parent].uuid,
          "token": $scope.gateways[parent].token,
          "method": "deletePlugin",
          "name": $scope.gateways[parent].plugins[idx].name
        }, function (deleteResult) {
          alert('plugin deleted');
        });
      };    

      $scope.addPlugin = function(idx){

        socket.emit('gatewayConfig', {
          "uuid": $scope.gateways[idx].uuid,
          "token": $scope.gateways[idx].token,
          "method": "installPlugin",
          "type": "skynet-greeting",
          "name": "mygreeting",
          "options": {greetingPrefix: "hello"}
        }, function (addResult) {
          // gateways[n].plugins = plugins.result;
          alert('subdevice added');
          console.log(addResult);
        });
      };    

      $scope.openNewSubdevice = function (gateway) {
        console.log(gateway);
        $scope.selectedGateway = gateway;       

        var modalInstance = $modal.open({
          templateUrl: 'subDeviceModal.html',
          scope: $scope,
          controller: function ($modalInstance) {

            // $scope.deviceProperties = _.
            console.log($scope);
            // console.log($scope.$parent);
            $scope.gatewayName = $scope.selectedGateway.name;
            $scope.plugins = $scope.selectedGateway.plugins;
            $scope.ok = function (subDeviceName, plugin, deviceProperties) {
            console.log("subDeviceName");
             console.log(subDeviceName);
              console.log("plugin");
               console.log(plugin);
                console.log("deviceProperties");
                console.log(deviceProperties);
             var properties = _.map(deviceProperties, function(deviceProperty){
              delete deviceProperty.$$hashKey;
              delete deviceProperty.type;
              delete deviceProperty.required;
              return deviceProperty;
             });

             $modalInstance.close({
              "name" : subDeviceName,
              "plugin" : plugin.name, 
              "deviceProperties" : deviceProperties 
             });
            };

            $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
            };

            $scope.getSchema = function (plugin){

              $scope.schema = plugin.optionsSchema;
              console.log($scope.schema); 

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
          },
          resolve: {
            // gateways: function () {
            //   return $scope.gateways;
            // }
            // deviceProperties : function(){
            //   var properties = _.each()
            // }
          }
        });

        modalInstance.result.then(function (response) {

          $scope.subDeviceName = response.name;
          $scope.plugin = response.plugin; 
          $scope.deviceProperties = response.deviceProperties;
          $scope.addSubdevice($scope.selectedGateway, response.plugin, response.name, response.deviceProperties);
          // if(response==='ok') {
          //   $log.info('clicked ok');
        }, function (){
          $log.info('Modal dismissed at: ' + new Date());
        });

      }

    }); //end skynet.js

  });  

});

e2eApp.controller('apiController', function($scope, $http, $location, $routeParams, $modal, $log, 
      channelService, userService) {

  $scope.skynetStatus = false;
  $scope.channel = {};
  $scope.user_channel = {};
  $scope.has_user_channel = false;
  $scope.custom_tokens = {};

  checkLogin($scope, $http, true, function(){
    $("#nav-connector").addClass('active');
    $("#main-nav").show();
    $("#main-nav-bg").show();
    
    channelService.getByName($routeParams.name, function(data) {
          
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
      //$location.path( '/api/auth/' + channel.name );
      var loc = '/api/auth/' + channel.name;
      console.log(loc);
      location.href = loc;
    };

    $scope.logo_url = function() {
      if(!$scope.channel || !$scope.channel['logo-color']) return '';

      return $scope.channel['logo-color'];
    };

  });

});

// function safeApply(scope, fn) {
//     (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
// }

e2eApp.controller('apieditorController', function($scope, $http, $location, $routeParams, $modal, $log, 
      channelService, userService) {

  $scope.skynetStatus = false;
  $scope.authtypes = [
      'none','simple','custom','oauth'
    ];

  $scope.isEdit = false;
  $scope.isNew = false;

  $scope.channel = {
    owneruuid: '',
    auth_strategy: '',
    logo: '',
    name: 'hixxxxxx',
    description: ''
  };
  $scope.channel.application = {
    base: '',
    doc: '',
    resources: [],
  };
  $scope.user_channel = {};
  $scope.has_user_channel = false;
  $scope.custom_tokens = {};

  checkLogin($scope, $http, true, function(){
    $("#nav-connector").addClass('active');
    $("#main-nav").show();
    $("#main-nav-bg").show();

    if($routeParams.name=='new') {
      $scope.isNew = true;
    } else {
      channelService.getByName($routeParams.name, function(data) {
          $scope.isNew = false;
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
    }

    $scope.setEditMode = function() {$scope.isEdit = true;};
    $scope.cancelEdit = function() {$scope.isEdit = false;};

    $scope.save = function() {
      if(!$scope.channel) return;

      return;
    };

    $scope.authorize = function (channel) {
      //$location.path( '/api/auth/' + channel.name );
      var loc = '/api/auth/' + channel.name;
      console.log(loc);
      location.href = loc;
    };

    $scope.logo_url = function() {
      if(!$scope.channel || !$scope.channel['logo-color']) return '';

      return $scope.channel['logo-color'];
    };

  });

});

e2eApp.controller('apiresourcesController', function($scope, $http, $location, $routeParams, $modal, $log, 
      channelService, userService) {

  $scope.skynetStatus = false;
  $scope.channel = {};
  $scope.user_channel = {};
  $scope.has_user_channel = false;
  $scope.custom_tokens = {};

  checkLogin($scope, $http, true, function(){
    $("#nav-connector").addClass('active');
    $("#main-nav").show();
    $("#main-nav-bg").show();
    
    channelService.getByName($routeParams.name, function(data) {
          
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
      if(!$scope.channel || !$scope.channel['logo-color']) return '';

      return $scope.channel['logo-color'];
    };

  });

});

e2eApp.controller('apiresourcedetailController', function($scope, $http, $location, $routeParams, $modal, $log, 
      channelService, userService) {

  $scope.skynetStatus = false;
  $scope.channel = {};
  $scope.user_channel = {};
  $scope.has_user_channel = false;
  $scope.custom_tokens = {};

  checkLogin($scope, $http, true, function(){
    $("#nav-connector").addClass('active');
    $("#main-nav").show();
    $("#main-nav-bg").show();
    
    channelService.getByName($routeParams.name, function(data) {
          
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
      if(!$scope.channel || !$scope.channel['logo-color']) return '';

      return $scope.channel['logo-color'];
    };

  });

});

e2eApp.controller('designerController', function($scope, $http, $location, nodeRedService) {

  checkLogin($scope, $http, true, function(){
    $(".active").removeClass();
    $("#nav-designer").addClass('active');
    $("#main-nav").show();
    $("#main-nav-bg").show();
    // $(document).trigger("nav-close");

    // Get NodeRed port number
    nodeRedService.getPort($scope.skynetuuid, $scope.skynettoken, function(data) {

      $scope.redPort = data.replace(/["']/g, "");
      $scope.redFrame = "http://" + $scope.skynetuuid + ":" + $scope.skynettoken + "@designer.octoblu.com:" + $scope.redPort;

      designerFrame.skynetid = $scope.skynetuuid;
      designerFrame.skynettoken = $scope.skynettoken;
      $scope.designerFrame = designerFrame;

    });

  });  

});

e2eApp.controller('analyzerController', function($scope, $http, $location) {
  checkLogin($scope, $http, true, function(){
    $(".active").removeClass();
    $("#nav-analyzer").addClass('active');
    $("#main-nav").show();
    $("#main-nav-bg").show();

    $scope.splunkFrame = "http://54.203.249.138:8000?output=embed";

  });
});

e2eApp.controller('gatewayController', function($scope, $http, $location, deviceService) {
  checkLogin($scope, $http, false, function(){
    $(".active").removeClass();
    $("#nav-connector").addClass('active');
    $("#main-nav").show();
    $("#main-nav-bg").show();

    deviceService.getDevice($location.search().uuid, function(data) {
      try{
        $scope.gatewayFrame = "http://" + data.localhost + ":" + data.port;
      } catch(e){
        $scope.gatewayFrame = "";
      }
    });    

  });
});

function checkLogin($scope, $http, secured, cb) {
  googleAnalytics();
  user = $.cookie("skynetuuid");
  if(user == undefined || user == null){
    if (secured){
      window.location.href = "/login";
    }
      
  } else {

    var userService = angular.injector(['e2eApp', 'ng']).get('userService');
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

  function googleAnalytics(){
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-2483685-30', 'octoblu.com');
    ga('send', 'pageview');    
  }

}
