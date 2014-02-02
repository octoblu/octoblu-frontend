// create the module and name it e2eApp
// var e2eApp = angular.module('e2eApp', ['ngRoute']); 
var e2eApp = angular.module('e2eApp', ['ngRoute', 'ui.bootstrap', 'ngAnimate']); 

// configure our routes
// e2eApp.config(function($routeProvider, $locationProvider, $sceDelegateProvider) {  
e2eApp.config(['$routeProvider', '$locationProvider', '$sceDelegateProvider', function($routeProvider, $locationProvider, $sceDelegateProvider) {

  $sceDelegateProvider.resourceUrlWhitelist([
    'self', 
    'http://*:*@red.meshines.com:*/**', 
    'http://*:*@designer.octoblu.com:*/**', 
    'http://skynet.im/**',
    'http://54.203.249.138:8000/**',
    '**'
  ]);

  $routeProvider

    // define SPA routes
    .when('/', {
      templateUrl : 'pages/home.html',
      controller  : 'mainController'
    })

    .when('/about', {
      templateUrl : 'pages/about.html',
      controller  : 'aboutController'
    })

    .when('/contact', {
      templateUrl : 'pages/contact.html',
      controller  : 'contactController'
    })

    .when('/profile', {
      templateUrl : 'pages/profile.html',
      controller  : 'profileController'
    })

    .when('/dashboard', {
      templateUrl : 'pages/dashboard.html',
      controller  : 'dashboardController'
    }) 

    .when('/connector', {
      templateUrl : 'pages/connector.html',
      controller  : 'connectorController'
    }) 

    .when('/designer', {
      templateUrl : 'pages/designer.html',
      controller  : 'designerController'
    }) 

    .when('/analyzer', {
      templateUrl : 'pages/analyzer.html',
      controller  : 'analyzerController'
    }) 

    .when('/controller', {
      templateUrl : 'pages/controller.html',
      controller  : 'controllerController'
    }) 

    .when('/community', {
      templateUrl : 'pages/community.html',
      controller  : 'communityController'
    }) 

    .when('/services', {
      templateUrl : 'pages/services.html',
      controller  : 'servicesController'
    }) 

    .when('/admin', {
      templateUrl : 'pages/admin.html',
      controller  : 'adminController'
    }) 

    .when('/docs', {
      templateUrl : 'pages/docs.html',
      controller  : 'docsController'
    }) 

    .when('/pricing', {
      templateUrl : 'pages/pricing.html',
      controller  : 'pricingController'
    }) 

    .when('/faqs', {
      templateUrl : 'pages/faqs.html',
      controller  : 'faqsController'
    }) 

    .when('/signup', {
      templateUrl : 'pages/signup.html',
      controller  : 'signupController'
    })

    .when('/login', {
      templateUrl : 'pages/login.html',
      controller  : 'loginController'
    })

    .when('/forgot', {
      templateUrl : 'pages/forgot.html',
      controller  : 'forgotController'
    });

    // .otherwise({redirectTo: '/'});
    // .otherwise({window.location.href='/'});
    
    $locationProvider
      .html5Mode(true)
      .hashPrefix('!');

// });
}]);

e2eApp.controller('mainController', function($scope, $location) {
  $("#main-nav").hide();
  user = $.cookie("skynetuuid");
  if(user != undefined ){
    window.location.href = "/dashboard";
  } else {  
    $scope.message = 'Home page content pending.';
  }

  $(document).ready(function () {
    /*INTRO*/ 
    // erosIntro(
    //   introId = 'mainintro'
    // );
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
   /*CONTACUS*/
   /*
   var c_windowHeight = $(window).height()0.5;
   var c_target = $('#contactus').offset().top;
   $(window).scroll(function(){
     var c_scrollHeight = $(window).scrollTop()+c_windowHeight;
     if (c_scrollHeight > c_target) {
       $('#contactus').slideDown(500);
     }
   });
   */
/*********************/  
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
    // $("#nav-community").addClass('active');
    $("#main-nav").show();
    $("#main-nav-bg").show();

  });  
});

e2eApp.controller('servicesController', function($scope, $http, $location) {
  checkLogin($scope, $http, false, function(){
    $(".active").removeClass();
    // $("#nav-community").addClass('active');
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

e2eApp.controller('dashboardController', function($scope, $http, $location) {
  $scope.message = 'Contact page content pending.';
  checkLogin($scope, $http, false, function(){
    $(".active").removeClass();
    $("#nav-dashboard").addClass('active');
    $("#main-nav").show();
    $("#main-nav-bg").show();

    // connect to skynet
    var skynetConfig = {
      "uuid": $scope.skynetuuid,
      "token": $scope.skynettoken
    }    
    skynet(skynetConfig, function (e, socket) {
      if (e) throw e

      $scope.skynetStatus = true
      // socket.emit('status', function(data){
      //   console.log('status received');
      //   console.log(data);
      // });   
      socket.on('message', function(channel, message){
        alert(JSON.stringify(message));
        console.log('message received', channel, message);
      });
    });

    // Get user devices
    $http.get('/api/owner/' + $scope.skynetuuid + '/' + $scope.skynettoken)
      .success(function(data) {
        // console.log(data);
        $scope.devices = data.devices;
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });


    // Live chart data
    var dps = []; // dataPoints

    var chart = new CanvasJS.Chart("chartContainer",{
      title :{
        text: "Live Sensor Data"
      },      
      data: [{
        type: "line",
        dataPoints: dps 
      }]
    });

    var xVal = 0;
    var yVal = 100; 
    var updateInterval = 20;
    var dataLength = 500; // number of dataPoints visible at any point

    var updateChart = function (count) {
      count = count || 1;
      // count is number of times loop runs to generate random dataPoints.
      
      for (var j = 0; j < count; j++) { 
        yVal = yVal +  Math.round(5 + Math.random() *(-5-5));
        dps.push({
          x: xVal,
          y: yVal
        });
        xVal++;
      };
      if (dps.length > dataLength)
      {
        dps.shift();        
      }
      
      chart.render();   

    };

    // generates first set of dataPoints
    updateChart(dataLength); 

    // update chart after specified time. 
    setInterval(function(){updateChart()}, updateInterval); 




  });  
});

e2eApp.controller('controllerController', function($scope, $http, $location) {
  checkLogin($scope, $http, false, function(){
    $(".active").removeClass();
    $("#nav-controller").addClass('active');
    $("#main-nav").show();
    $("#main-nav-bg").show();

    // Get user devices
    $http.get('/api/owner/' + $scope.skynetuuid + '/' + $scope.skynettoken)
      .success(function(data) {
        // console.log(data);
        $scope.devices = data.devices;
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });

    // // connect to skynet
    // var skynetConfig = {
    //   "uuid": $scope.skynetuuid,
    //   "token": $scope.skynettoken
    // }    
    // skynet(skynetConfig, function (e, socket) {
    //   if (e) throw e

    //   $scope.skynetStatus = true
    //   // socket.emit('status', function(data){
    //   //   console.log('status received');
    //   //   console.log(data);
    //   // });   
    //   socket.on('message', function(channel, message){
    //     alert(JSON.stringify(message));
    //     console.log('message received', channel, message);
    //   });
    // });

    $scope.sendMessage = function(){
      // console.log($scope.device);
      // console.log($scope.sendUuid);
      // console.log($scope.sendText);

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
        $http.post('/api/message/', {uuid: uuid, message: $scope.sendText})                
          .success(function(data) {
            // console.log(data);
            $scope.messageOutput = data;
          })
          .error(function(data) {
            console.log('Error: ' + data);
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

e2eApp.controller('connectorController', function($scope, $http, $location) {
  $scope.skynetStatus = false
  checkLogin($scope, $http, true, function(){
    $(".active").removeClass();
    $("#nav-connector").addClass('active');
    $("#main-nav").show();
    $("#main-nav-bg").show();

    $scope.activeTab = 'devices';
    $("#devices").addClass('active')

    // connect to skynet
    var skynetConfig = {
      "uuid": $scope.skynetuuid,
      "token": $scope.skynettoken
    }    
    skynet(skynetConfig, function (e, socket) {
      if (e) throw e

      $scope.skynetStatus = true
      // socket.emit('status', function(data){
      //   console.log('status received');
      //   console.log(data);
      // });   
      // socket.on('message', function(channel, message){
      //   alert(JSON.stringify(message));
      //   console.log('message received', channel, message);
      // });
    });

    // Get user devices
    $http.get('/api/owner/' + $scope.skynetuuid + '/' + $scope.skynettoken)
      .success(function(data) {
        // console.log(data);
        $scope.devices = data.devices;
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });

    // // Get NodeRed port number
    // $http.get('/api/redport/' + $scope.skynetuuid + '/' + $scope.skynettoken)
    //   .success(function(data) {
    //     $scope.redPort = data.replace(/["']/g, "");
    //   })
    //   .error(function(data) {
    //     console.log('Error: ' + data);
    //   });

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
          

          $http.put('/api/devices/' + $scope.skynetuuid, formData)                
            .success(function(data) {
              // console.log(data);
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
            })
            .error(function(data) {
              console.log('Error: ' + data);
            });
        } else {

          $http.post('/api/devices/' + $scope.skynetuuid, formData)                
            .success(function(data) {
              // console.log(data);
              try{
                $scope.devices.push(data);
                $scope.deviceName = "";
                $scope.keys = [{}];
              } catch(e){
                $scope.devices = [data];
              }
              $scope.addDevice = false;
            })
            .error(function(data) {
              console.log('Error: ' + data);
            });
        }
      }
      
    };

// {"_id":"52e6e1164980420c4a0001ee","channel":"main","name":"arduino","online":false,"owner":"5d6e9c91-820e-11e3-a399-f5b85b6b9fd0","socketId":"F4CCXnUcloecvBy6ckfg","timestamp":1391113055741,"token":"xjq9h3yzhemf5hfrme8y08fh0sm50zfr","uuid":"742401f1-87a4-11e3-834d-670dadc0ddbf","$$hashKey":"00I"}

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
      $scope.keys = keys;
    }

    $scope.deleteDevice = function( idx ){

      var device_to_delete = $scope.devices[idx];

      $http.delete('/api/devices/' + device_to_delete.uuid + '/' + device_to_delete.token)                
        .success(function(data) {
          // console.log(data);
          $scope.devices.splice(idx, 1);
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
      
    };

    $scope.keys = [{key:'', value:''}];    
    $scope.addKeyVals = function() {
      $scope.keys.push( {key:'', value:''} ); 
    }



  });  


  // curl -X POST -d '{"devices": "5d6e9c91-820e-11e3-a399-f5b85b6b9fd0", "message": {"yellow":"off"}}' http://skynet.im/messages 


});

e2eApp.controller('designerController', function($scope, $http, $location) {

  checkLogin($scope, $http, true, function(){
    $(".active").removeClass();
    $("#nav-designer").addClass('active');
    $("#main-nav").show();
    $("#main-nav-bg").show();
    $(document).trigger("nav-close");

    // Get NodeRed port number
    $http.get('/api/redport/' + $scope.skynetuuid + '/' + $scope.skynettoken)
      .success(function(data) {
        $scope.redPort = data.replace(/["']/g, "");
        $scope.redFrame = "http://" + $scope.skynetuuid + ":" + $scope.skynettoken + "@designer.octoblu.com:" + $scope.redPort;

        designerFrame.skynetid = $scope.skynetuuid;
        designerFrame.skynettoken = $scope.skynettoken;
        $scope.designerFrame = designerFrame;

        // $scope.redFrame = "http://skynet.im";
        console.log($scope.redFrame);
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });

  });  

});

e2eApp.controller('analyzerController', function($scope, $http, $location) {
  checkLogin($scope, $http, true, function(){
    $(".active").removeClass();
    $("#nav-analyzer").addClass('active');
    $("#main-nav").show();
    $("#main-nav-bg").show();

    $scope.splunkFrame = "http://54.203.249.138:8000?output=embed"
    // $scope.redFrame = "http://skynet.im";

  });
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

    $http.get('/api/user/' + user)
      .success(function(data) {
        $scope.user_id = data._id;

        $(".auth").hide();
        $(".user-menu").show();
        $(".toggle-nav").show();
        $(".navbar-brand").attr("href", "/dashboard");

        if (data.local) {
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

      })
      .error(function(data) {
        console.log('Error: ' + data);
        // return false;
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
 
