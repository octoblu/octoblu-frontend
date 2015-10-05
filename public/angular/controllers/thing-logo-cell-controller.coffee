class ThingLogoCellController
  constructor: ($scope, OCTOBLU_ICON_URL) ->
    @OCTOBLU_ICON_URL = OCTOBLU_ICON_URL
    @row = $scope.row
    $scope.$watch ['row.name', 'row.uuid'], @updateTitle
    $scope.$watch 'row.type', @updateLogo
    $scope.$watch 'row.type', @updateType

  updateLogo: =>
    type = @row.type ? 'device:other'
    filePath = type.replace('octoblu:', 'device:').replace ':', '/'
    @logo ?= "#{@OCTOBLU_ICON_URL}#{filePath}.svg"

  updateTitle: =>
    @name = if _.isEmpty(@row.name) then @row.uuid else @row.name
    @name = "Octoblu User" if @row.type == 'octoblu:user'

  updateType: =>
    @type = @row.type

angular.module('octobluApp').controller 'ThingLogoCellController', ThingLogoCellController
