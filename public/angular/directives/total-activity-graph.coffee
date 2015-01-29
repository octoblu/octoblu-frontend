angular.module('octobluApp')
.directive 'totalActivityGraph', ->
  restrict: 'E'
  replace: false
  templateUrl: 'pages/total-activity-graph.html'
  scope:
    devices: '='
  link: =>
