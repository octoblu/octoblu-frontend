class AddNodeWizardController
  constructor: (OCTOBLU_API_URL, $scope, $state, NodeTypeService) ->
    @scope = $scope
    @state = $state
    @NodeTypeService = NodeTypeService

    @NodeTypeService.getById(@state.params.nodeTypeId).then (nodeType) =>
      @scope.nodeType = nodeType

  connectThings: () =>
    redirectToDesign = @state.params.designer || false
    @scope.nextState = 'material.nodewizard-adddevice'

    if @scope.nodeType.category == 'channel'
      @scope.nextState = 'material.nodewizard-addchannel.default-options'

    if @scope.nodeType.connector
      @scope.nextState = 'material.nodewizard-addsubdevice.selectgateblu'

    @state.go(@scope.nextState, {nodeTypeId : @state.params.nodeTypeId, designer: redirectToDesign}, {location: false})

angular.module('octobluApp').controller 'AddNodeWizardController', AddNodeWizardController
