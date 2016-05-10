class ThingLogoCellController
  constructor: ($scope, DeviceLogo) ->
    @row = $scope.row
    @DeviceLogo = DeviceLogo
    $scope.$watch ['row.name', 'row.uuid'], @updateTitle
    $scope.$watch 'row.type', @updateLogo
    $scope.$watch 'row.type', @updateType

  updateLogo: =>
    @row.logo = new @DeviceLogo(@row).get()

  updateTitle: =>
    @name = if _.isEmpty(@row.name) then @row.uuid else @row.name
    @name = "Octoblu User" if @row.type == 'octoblu:user'

  updateType: =>
    @type = @row.type

angular.module('octobluApp').controller 'ThingLogoCellController', ThingLogoCellController
