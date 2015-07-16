angular.module('octobluApp')
.directive 'inputFocus',  ($window) ->
  restrict: 'A'
  scope:
    trigger: '=inputFocus'
  link: (scope, element) ->
    scope.$watch 'trigger', (value) ->
      if value == true
        element[0].focus()
        scope.trigger = false
