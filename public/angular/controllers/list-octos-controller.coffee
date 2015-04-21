class ListOctosController
  constructor: ($scope, OctoService) ->
    @OctoService = OctoService
    @refresh()
    @octos = []

  addOcto: =>
    return unless @canAddOcto()
    @OctoService.add()
    @octos.push({})

  canAddOcto: =>
    _.size(@octos) < 1

  canRemoveOcto: =>
    _.size(@octos) > 0

  refresh: =>
    @OctoService.list()
      .then (octos) =>
        @octos = octos
      .catch (error) =>
        @errorMessage = error.message

  removeErrorMessage: =>
    @errorMessage = null

  removeOcto: =>
    return unless @canRemoveOcto()
    @OctoService.remove()
    @octos = _.drop(@octos, 1)

angular.module('octobluApp').controller 'ListOctosController', ListOctosController
