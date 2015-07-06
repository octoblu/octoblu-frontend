angular.module('octobluApp')
.directive 'randomRobot', ->
  {
    restrict: 'E',
    templateUrl: '/pages/random-robot.html',
    replace: true,
    transclude: true,
    controller : 'RandomRobotController',
    controllerAs : 'controller',
    scope : {
      title : '@'
    }
  }
