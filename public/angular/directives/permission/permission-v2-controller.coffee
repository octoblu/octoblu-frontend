class PermissionV2Controller
  constructor: ($scope) ->
    {@type, list} = $scope

    $scope.$watch 'list', =>
      @list = _.reject $scope.list, uuid: '*'
      $scope.everyone = _.some $scope.list, uuid: '*'

    $scope.$watch 'everyone', (newEveryone, oldEveryone) =>
      return if $scope.everyone == _.some $scope.list, uuid: '*'
      return $scope.addPermission @type, uuid: '*' if newEveryone
      $scope.removePermission @type, uuid: '*'

angular.module('octobluApp').controller 'PermissionV2Controller', PermissionV2Controller
