angular.module('octobluApp')
.directive 'randomRobot', ->
  {
    restrict: 'E',
    templateUrl: '/angular/directives/random-robot/random-robot.html',
    replace: true,
    transclude: true,
    controller : 'RandomRobotController',
    controllerAs : 'controller',
    scope : {
      title : '@'
    }
  }
