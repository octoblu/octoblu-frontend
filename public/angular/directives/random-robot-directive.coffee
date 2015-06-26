angular.module('octobluApp')
.directive 'randomRobot',  ($window) ->
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
