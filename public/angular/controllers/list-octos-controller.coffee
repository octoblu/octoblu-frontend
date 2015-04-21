class ListOctosController
  constructor: ($scope, OctoService) ->
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


angular.module('octobluApp').controller 'ListOctosController', ListOctosController
