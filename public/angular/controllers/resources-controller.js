'use strict';

angular.module('octobluApp')
    .controller('ResourcesController', function($rootScope, $scope, $http) {

      $scope.resources = [
        {
          title : 'Getting started with Octoblu',
          link : 'https://youtu.be/UAT1F8hF-nI?list=PLyh2CvBTlon4R_ibknRl9CCKfn_1eAted',
          icon : 'fa fa-play',
          image: 'https://s3-us-west-2.amazonaws.com/octoblu-icons/resources/tutorial.png'
        },

        {
          title : 'Getting started with Octoblu Documentation',
          link : 'http://cdn.ws.citrix.com/wp-content/uploads/2015/01/Octoblu_Getting_Started.pdf?_ga=1.196412460.1064020618.1427145342',
          icon : 'fa fa-book',
          image: 'https://s3-us-west-2.amazonaws.com/octoblu-icons/resources/other.png'
        },

        {
          title : 'Hackster Tutorials',
          link : 'http://www.hackster.io/octoblu',
          icon : 'fa fa-book',
          image: 'https://s3-us-west-2.amazonaws.com/octoblu-icons/resources/johnny.png'

        },

        {
          title : 'Citrix Developer Octoblu Playlist',
          link : 'https://www.youtube.com/playlist?list=PLyh2CvBTlon4R_ibknRl9CCKfn_1eAted',
          icon : 'fa fa-play',
           image: 'https://s3-us-west-2.amazonaws.com/octoblu-icons/resources/cd.png'

        },

        {
          title : 'Octoblu Developer Site',
          link : 'https://developer.octoblu.com',
          icon : 'fa fa-link',
          image: 'https://s3-us-west-2.amazonaws.com/octoblu-icons/resources/octoblu.png'
        },

      ];

    });
