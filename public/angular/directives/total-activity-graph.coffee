angular.module('octobluApp')
.directive 'totalActivityGraph', ($window) ->
  restrict: 'E'
  replace: true
  templateUrl: '/pages/total-activity-graph.html'
  scope:
    devices: '='
    lineA: '='
    lineB: '='
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
    canvas.width = $(element).parent().width()
    canvas.height = 150

    scope.$watch (-> $(element).parent().width()), (newWidth) ->
      canvas.width = newWidth

    smoothie.streamTo canvas

    lines =
      lineA:
        line: new TimeSeries()
        color: '#b58900'
      lineB:
        line: new TimeSeries()
        color: '#cb4b16'


    smoothie.addTimeSeries lines.lineA.line, strokeStyle: lines.lineA.color, lineWidth: 3
    smoothie.addTimeSeries lines.lineB.line, strokeStyle: lines.lineB.color, lineWidth: 3


    scope.$watch 'lineA', (value) ->
      render()
    , true

    scope.$watch 'lineB', (value) ->
      render()
    , true


    lineToData = (line) =>
      return line if angular.isArray line
      [] # What? I don't even? --crazy owl

    renderNow = =>
      a = _.last(scope.lineA) ? 0
      b = _.last(scope.lineB) ? 0
      lines.lineA.line.append new Date().getTime(), a
      lines.lineB.line.append new Date().getTime(), b

    render = _.throttle renderNow, 500

