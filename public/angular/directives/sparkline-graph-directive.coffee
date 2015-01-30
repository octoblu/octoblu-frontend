angular.module('octobluApp')
.directive 'sparklineGraph', ->
  restrict: 'E'
  template: '<div></div>'
  scope:
    graphHeight: '@'
    graphWidth: '@'
    lineA: '='
    lineB: '='

  link: (scope, elem, attrs) ->
    opts = {}

    opts.type = attrs.type || 'line'
    opts.chartRangeMin = 0
    opts.spotRadius = 0
    opts.disableTooltips = true
    opts.disableInteraction = true
    opts.height = scope.graphHeight ? 'auto'
    opts.width = scope.graphWidth ? 'auto'

    scope.$watch 'lineA', ((value) ->
      render()
    ), true

    scope.$watch 'lineB', ((value) ->
      render()
    ), true

    lineToData = (line) =>
      return line if angular.isArray line

      [] # What? I don't even? --crazy owl

    renderNow = () ->
      lineA = scope.lineA
      lineB = scope.lineB

      optsA = _.cloneDeep opts
      optsA.lineColor = 'blue'
      optsA.fillColor = false
      optsB = _.cloneDeep opts
      optsB.lineColor = 'red'
      optsB.fillColor = false

      dataA = lineToData(lineA)
      dataB = lineToData(lineB)

      if lineA? && lineB?
        optsB.composite = true

      if lineA?
        $(elem.find('div')[0]).sparkline dataA, optsA
      if lineB?
        $(elem.find('div')[0]).sparkline dataB, optsB

    render = _.throttle renderNow, 500
