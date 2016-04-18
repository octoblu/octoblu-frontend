class RootController
  constructor: ($state) ->
    @state = $state
    @state.go('material.design')

angular.module('octobluApp').controller 'RootController', RootController
