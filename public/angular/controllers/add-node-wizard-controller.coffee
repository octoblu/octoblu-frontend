class AddNodeWizardController
  constructor: ($scope, $state, NodeTypeService) ->
    @scope = $scope
    @state = $state

    @NodeTypeService = NodeTypeService

    @redirectToDesign = @state.params.designer || false
    @redirectToWizard = @state.params.wizard || false

    @NodeTypeService.getById(@state.params.nodeTypeId).then (nodeType) =>
      @scope.nodeType = nodeType
      fragments = @generateBreadcrumbFragments nodeType

  connectThings: () =>
    @scope.nextState = 'material.nodewizard-adddevice'

    if @scope.nodeType.category == 'channel'
      @scope.nextState = 'material.nodewizard-addchannel.default-options'

    if @scope.nodeType.category == 'endo'
      @scope.nextState = 'material.nodewizard-addendo'

    if @scope.nodeType.category == 'forwarder'
      @scope.nextState = 'material.nodewizard-add-forwarder'

    if @scope.nodeType.connector?
      @scope.nextState = 'material.nodewizard-addsubdevice.selectgateblu'

    stateParams =
      nodeTypeId : @state.params.nodeTypeId
      designer: @redirectToDesign
      wizard: @redirectToWizard
      wizardFlowId: @state.params.wizardFlowId
      wizardNodeIndex: @state.params.wizardNodeIndex

    @state.go @scope.nextState, stateParams, location: true

  generateBreadcrumbFragments: (nodeType) =>
    @linkTo = linkTo: 'material.things.all', label: 'All Things'
    if @redirectToDesign
      @linkTo = linkTo: 'material.design', label: 'Designer'
    if @redirectToWizard
      @linkTo =
        linkTo: 'material.flowConfigure'
        label: 'Flow Configure'
        params:
          flowId: @state.params.wizardFlowId
          nodeIndex: @state.params.wizardNodeIndex

    @fragments = [@linkTo, {label: "Add #{nodeType.name}"}]

angular.module('octobluApp').controller 'AddNodeWizardController', AddNodeWizardController
