angular.module('octobluApp')
.directive 'totalActivityGraph', ->
  restrict: 'E'
  replace: true
  # templateUrl: '/pages/total-activity-graph.html'
  scope:
    devices: '='
  link: =>
