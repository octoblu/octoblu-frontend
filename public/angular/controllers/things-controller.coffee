class ThingsController
  constructor:  ($scope, $state, $location) ->
    @scope = $scope
    @state = $state
    @setSelectedTab @state.current.name
    $scope.$on '$stateChangeStart', (event, toState) =>
      @setSelectedTab toState.name

  setSelectedTab: (stateName) =>
    if stateName == 'material.things'
      return @state.go 'material.things.my', {}, {location: 'replace'}
    @scope.selectedTab = stateName

angular.module('octobluApp').controller 'ThingsController', ThingsController
