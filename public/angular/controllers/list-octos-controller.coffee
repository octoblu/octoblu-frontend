class ListOctosController
  constructor: ($scope, OctoService) ->
    @OctoService = OctoService
    @refresh()
    @octos = []

  addOcto: =>
    return unless @canAddOcto()
    @OctoService.add().then (octo) =>
      @octos.push octo

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
    unless @canRemoveOcto()
      @errorMessage = 'Octo limit reached'
      return
    octoToRemove = _.first(@octos)
    @OctoService.remove octoToRemove
    @octos = _.without @octos, octoToRemove

angular.module('octobluApp').controller 'ListOctosController', ListOctosController
