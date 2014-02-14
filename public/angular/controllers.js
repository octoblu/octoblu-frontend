e2eApp.controller('mainController', function(checkLogin$scope, $location) {
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
        }

          // Setup dashboard arrays for devices
          dataPoints.push({label: data.devices[i].name, y: 0, uuid: data.devices[i].uuid }); 
          deviceData[data.devices[i].uuid] = 0;
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



    // // Live chart data
    // var dps = []; // dataPoints

    // var chart = new CanvasJS.Chart("chartContainer",{
    //   title :{
    //     text: "Live Sensor Data"
    //   },      
    //   data: [{
    //     type: "line",
    //     dataPoints: dps 
    //   }]
    // });

    // var xVal = 0;
    // var yVal = 100; 
    // var updateInterval = 20;
    // var dataLength = 500; // number of dataPoints visible at any point

    // var updateChart = function (count) {
    //   count = count || 1;
    //   // count is number of times loop runs to generate random dataPoints.
      
    //   for (var j = 0; j < count; j++) { 
    //     yVal = yVal +  Math.round(5 + Math.random() *(-5-5));
    //     dps.push({
    //       x: xVal,
    //       y: yVal
    //     });
    //     xVal++;
    //   };
    //   if (dps.length > dataLength)
    //   {
    //     dps.shift();        
    //   }
      
    //   chart.render();   

    // };

    // // generates first set of dataPoints
    // updateChart(dataLength); 

    // // update chart after specified time. 
    // setInterval(function(){updateChart()}, updateInterval); 




    // // dataPoints
    // var dataPoints1 = [];
    // var dataPoints2 = [];

    // var chart = new CanvasJS.Chart("chartContainer",{
    //   zoomEnabled: true,
    //   title: {
    //     text: "Device Activity"    
    //   },
    //   toolTip: {
    //     shared: true
        
    //   },
    //   legend: {
    //     verticalAlign: "top",
    //     horizontalAlign: "center",
    //     fontSize: 14,
    //     fontWeight: "bold",
    //     fontFamily: "calibri",
    //     fontColor: "dimGrey"
    //   },
    //   axisX: {
    //     title: "chart updates on every device event"
    //   },
    //   axisY:{
    //     prefix: '',
    //     includeZero: false
    //   }, 
    //   data: [{ 
    //     // dataSeries1
    //     type: "line",
    //     xValueType: "dateTime",
    //     showInLegend: true,
    //     name: "Company A",
    //     dataPoints: dataPoints1
    //   },
    //   {       
    //     // dataSeries2
    //     type: "line",
    //     xValueType: "dateTime",
    //     showInLegend: true,
    //     name: "Company B" ,
    //     dataPoints: dataPoints2
    //   }]
    // });



    // var updateInterval = 3000;
    // // initial value
    // var yValue1 = 640; 
    // var yValue2 = 604;

    // var time = new Date;
    // time.setHours(9);
    // time.setMinutes(30);
    // time.setSeconds(00);
    // time.setMilliseconds(00);
    // // starting at 9.30 am

    // var updateChart = function (count) {
    //   count = count || 1;

    //   // count is number of times loop runs to generate random dataPoints. 

    //   for (var i = 0; i < count; i++) {
        
    //     // add interval duration to time        
    //     time.setTime(time.getTime()+ updateInterval);


    //     // generating random values
    //     var deltaY1 = .5 + Math.random() *(-.5-.5);
    //     var deltaY2 = .5 + Math.random() *(-.5-.5);

    //     // adding random value and rounding it to two digits. 
    //     yValue1 = Math.round((yValue1 + deltaY1)*100)/100;
    //     yValue2 = Math.round((yValue2 + deltaY2)*100)/100;
        
    //     // pushing the new values
    //     dataPoints1.push({
    //       x: time.getTime(),
    //       y: yValue1
    //     });
    //     dataPoints2.push({
    //       x: time.getTime(),
    //       y: yValue2
    //     });


    //   };

    //   // updating legend text with  updated with y Value 
    //   chart.options.data[0].legendText = " Company A  $" + yValue1;
    //   chart.options.data[1].legendText = " Company B  $" + yValue2; 

    //   chart.render();

    // };

    // // generates first set of dataPoints 
    // updateChart(3000);  
     
    // // update chart after specified interval 
    // setInterval(function(){updateChart()}, updateInterval);




//     var chart = new CanvasJS.Chart("chartContainer", {
//         theme: "theme2",//theme1
//         title:{
//             text: "Real-time Device Activity"              
//        },
//         data: [              
//         {
// // Change type to "bar", "splineArea", "area", "spline", "pie",etc.
//             type: "column",
//             dataPoints: [
//             { label: "apple", y: 10 },
//             { label: "orange", y: 15 },
//             { label: "banana", y: 25 },
//             { label: "mango", y: 30 },
//             { label: "grape", y: 28 }
//             ]
//         }
//         ]
//     });

//     chart.render();


    // chart.options.data[0].dataPoints = [
    //         { label: "apple", y: 20 },
    //         { label: "orange", y: 15 },
    //         { label: "banana", y: 25 },
    //         { label: "mango", y: 30 },
    //         { label: "grape", y: 28 }
    //         ]
    // chart.render();




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
        messageService.sendMessage(uuid, $scope.sendText, function(data) {
          $scope.messageOutput = data;
        });

      }
    }

  });  
});

e2eApp.controller('communityController', function($scope, $http, $location) {
  checkLogin($scope, $http, false, function(){
    $(".active").removeClass();
    $("#nav-community").addClass('active');
    $("#main-nav").show();
    $("#main-nav-bg").show();

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

e2eApp.controller('connectorController', function($scope, $http, $location, $modal, $log, 
      ownerService, deviceService, channelService) {
  $scope.skynetStatus = false;
  $scope.channelList = [];

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
    } else if($location.$$path == "/tools") {
      $scope.activeTab = 'devtools';
    }


    // Get user devices
    ownerService.getDevices($scope.skynetuuid, $scope.skynettoken, function(data) {
      $scope.devices = data.devices;
    });

    // Get user gateways
    ownerService.getGateways($scope.skynetuuid, $scope.skynettoken, function(data) {
      $scope.gateways = data.gateways;
    });

    // get api list, if showing api
    if($scope.activeTab == 'apis') {
      channelService.getList(function(data) {
        $scope.channelList = data;
      });
    }

    $scope.openDetails = function (channel) {
      // $scope.channel = channel;
      $location.path( '/apis/' + channel.name );
    };

    $scope.getLogoLink = function (channel) {      
      if($scope.current_user.api) {
        for(var l = 0; l<$scope.current_user.api.length; l++) {
          if($scope.current_user.api[l].name===channel.name) {
            return channel['logo-color'];
          }
        }
      }

      // if(channel.name==='LinkedIn') return channel['logo-color'];
      
      return channel['logo-bw'];
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

  });  

});

e2eApp.controller('apiController', function($scope, $http, $location, $routeParams, $log, 
      ownerService, channelService) {

  console.log($routeParams.name);
  
  $scope.skynetStatus = false;
  $scope.channel = {};

  checkLogin($scope, $http, true, function(){
    $(".active").removeClass();
    $("#nav-connector").addClass('active');
    $("#main-nav").show();
    $("#main-nav-bg").show();

    // get api list, if showing api
    // channelService.getList(function(data) {
    //   $scope.channelList = data;
    // });
    console.log($routeParams.name);
    channelService.getByName($routeParams.name, function(data) {
        $scope.channel = data;
      });

    $scope.authorize = function (channel) {
      //$location.path( '/api/auth/' + channel.name );
      location.href = '/api/auth/' + channel.name;
    };

    $scope.logo_url = function() {
      if(!$scope.channel || !$scope.channel['logo-color']) return '';

      return $scope.channel['logo-color'];
    };

  });

});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

var ModalInstanceCtrl = function ($scope, $modalInstance, items, channel) {

  $scope.items = items;
  $scope.channel = channel;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

e2eApp.controller('designerController', function($scope, $http, $location, nodeRedService) {

  checkLogin($scope, $http, true, function(){
    $(".active").removeClass();
    $("#nav-designer").addClass('active');
    $("#main-nav").show();
    $("#main-nav-bg").show();
    $(document).trigger("nav-close");

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

e2eApp.controller('ModalDemoCtrl', function ($scope, $modal, $log) {

  
});

function checkLogin($scope, $http, secured, cb) {
  googleAnalytics();
  user = $.cookie("skynetuuid");
  // console.log(user);  
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