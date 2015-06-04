'use strict';

angular
  .module('octobluApp')
  .controller('ResourcesController', function($rootScope, $scope, $http) {
    $scope.resources = [
      {
        title: 'Flow Tutorial',
        link: '/tutorial/create',
        summary: 'Learn to create your own flow by importing the tutorial flow.'
      },
      {
        title: 'Getting started with Octoblu Video',
        link: 'https://youtu.be/UAT1F8hF-nI?list=PLyh2CvBTlon4R_ibknRl9CCKfn_1eAted',
        summary: 'Octoblu quick start tutorial video is a great way to familiarize yourself with creating solutions with Octoblu.',
      },
      {
        title: 'Getting started with Octoblu Documentation',
        link: 'http://cdn.ws.citrix.com/wp-content/uploads/2015/01/Octoblu_Getting_Started.pdf?_ga=1.196412460.1064020618.1427145342',
        summary: 'Documentation for "Getting started with Octoblu".',
      },
      {
        title: 'Octoblu & Meshblu Developer Site',
        link: 'https://developer.octoblu.com',
        summary: 'Documentation for developers.',
      },
      {
        title: 'Building A Connector Tutorial',
        link: 'https://github.com/octoblu/generator-meshblu-connector/wiki/Tutorial:-Building-a-custom-meshblu-device',
        summary: 'Tutorial on how to build a custom meshblu device (connector).',
      },
      {
        title: 'Gateblu Gateway & Documentation',
        link: 'https://gateblu.octoblu.com/',
        summary: 'Gateblu allows you to connect smart devices, motors, servos, sensors and additional protocols to Meshblu and Octoblu!',
      },
      {
        title: 'Octoblu Blog',
        link: 'http://blog.citrix.com/team/octoblu/',
        summary: 'Stay up-to-date with Octoblu.',
      },
      {
        title: 'Octoblu Developer YouTube Playlist',
        link: 'https://www.youtube.com/playlist?list=PLyh2CvBTlon4R_ibknRl9CCKfn_1eAted',
        summary: 'A variety of YouTube video tutorials on how to use Octoblu.',
      },
      {
        title: 'Hackster Tutorials',
        link: 'http://www.hackster.io/octoblu',
        summary: 'Step-by-step walkthroughs using Octoblu\'s platform with your devices.',
      },
      {
        title: 'Blu - iOS',
        link: 'https://itunes.apple.com/us/app/blu/id938900017?mt=8',
        summary: 'Blu for iOS provides a dead simple way for Octoblu users to trigger flows created in the Octoblu designer. With a simple click of a button, you can do just about anything.',
      },
      {
        title: 'Blu - Android',
        link: 'https://play.google.com/store/apps/details?id=com.octoblu.blu',
        summary: 'Blu for Android provides a dead simple way for Octoblu users to trigger flows created in the Octoblu designer. With a simple click of a button, you can do just about anything.',
      },
      {
        title: 'Contact via Chat',
        link: 'https://gitter.im/octoblu/help',
        summary: 'Chat with the Octoblu team.',
      },
      {
        title: 'Status',
        link: 'http://status.octoblu.com/',
        summary: 'View the current status of the designer.',
      }
    ];
  });
