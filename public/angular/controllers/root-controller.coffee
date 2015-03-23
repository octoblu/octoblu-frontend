class RootController
  constructor: ($state) ->
    @state = $state
    @state.go('material.home')

angular.module('octobluApp').controller 'RootController', RootController
