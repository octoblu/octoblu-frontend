class ListOctosController
  constructor: ($mdToast, $scope, OctoService) ->
    @mdToast = $mdToast
    @OctoService = OctoService
    @refresh()
    @octos = [
      {name: 'Octo 1', online: false}
      {name: 'Octo 2', online: true}
    ]

  refresh: =>
    @OctoService.list()
      .then (octos) =>
        @octos = octos
      .catch (error) =>
        @errorMessage = error.message
        toast = @mdToast.simple(position: 'top right').content @errorMessage
        @mdToast.show toast


angular.module('octobluApp').controller 'ListOctosController', ListOctosController
