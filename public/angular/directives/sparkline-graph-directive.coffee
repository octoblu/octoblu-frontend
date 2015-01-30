angular.module('octobluApp')
.directive 'sparklineGraph', ->
  restrict: 'A'
  require: 'ngModel'
  link: (scope, elem, attrs, ngModel) ->
    opts = {}

    opts.type = attrs.type || 'line'
    opts.chartRangeMin = 0
    opts.spotRadius = 0
    opts.disableTooltips = true
    opts.disableInteraction = true
    opts.width = 100

    scope.$watch attrs.ngModel, ((value) ->
      render()
    ), true

    scope.$watch attrs.opts, ((value) ->
      render()
    ), true

    render = () ->
      angular.extend opts, angular.fromJson(attrs.opts) if attrs.opts

      model = ngModel.$viewValue

      if angular.isArray(model)
        data = model
      else
        if model?
          data = model.split(",")
        else
          data = []

      $(elem).sparkline data, opts
