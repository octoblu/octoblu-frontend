class AddNodeWizardController
  constructor: (OCTOBLU_API_URL, $scope, $state, NodeTypeService) ->
    @scope = $scope
    @state = $state
    @NodeTypeService = NodeTypeService
    @NodeTypeService.getById(@state.params.nodeTypeId).then (nodeType) =>
      @scope.nodeType = nodeType

  connectThings: (nodeType) =>
    @scope.nextState = 'material.nodewizard.adddevice'
    if nodeType.category == 'channel' then @scope.nextState = 'material.nodewizard.addchannel.default-options'
    if nodeType.connector then @scope.nextState = 'material.nodewizard.addsubdevice.selectgateblu'
    @state.go(@scope.nextState, {nodeTypeId : @state.params.nodeTypeId}, {location: 'replace'})

angular.module('octobluApp').controller 'AddNodeWizardController', AddNodeWizardController
