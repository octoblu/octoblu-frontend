angular.module('octobluApp')
.directive 'totalActivityGraph', ->
  restrict: 'E'
  replace: false
  templateUrl: 'pages/total-activity-graph.html'
  scope:
    devices: '='
  controller: 'TotalActivityGraphController'

  link: (scope, element) =>
    smoothie = new SmoothieChart {
      grid:
        strokeStyle: '#657b83'
        fillStyle: '#002b36'
        lineWidth: 1
        millisPerLine: 250
        verticalSections: 6
      labels:
        fillStyle: '#fdf6e3'
    }
    canvas = element.find('canvas')[0]
    canvas.width = element.parent().width()
    smoothie.streamTo canvas

