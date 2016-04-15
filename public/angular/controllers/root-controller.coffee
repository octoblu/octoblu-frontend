class RootController
  constructor: ($state) ->
    @state = $state
    @state.go('material.dashboard')

angular.module('octobluApp').controller 'RootController', RootController
