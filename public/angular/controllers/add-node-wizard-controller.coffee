class AddNodeWizardController
  constructor: ($scope, $state, NodeTypeService) ->
    @scope = $scope
    @state = $state
    @NodeTypeService = NodeTypeService

    @redirectToDesign = @state.params.designer || false

    @NodeTypeService.getById(@state.params.nodeTypeId).then (nodeType) =>
      @scope.nodeType = nodeType
      fragments = @generateBreadcrumbFragments nodeType

  connectThings: () =>
    @scope.nextState = 'material.nodewizard-adddevice'

    if @scope.nodeType.category == 'channel'
      @scope.nextState = 'material.nodewizard-addchannel.default-options'

    if @scope.nodeType.connector
      @scope.nextState = 'material.nodewizard-addsubdevice.selectgateblu'

    stateParams =
      nodeTypeId : @state.params.nodeTypeId
      designer: @redirectToDesign

    @state.go @scope.nextState, stateParams, location: true

  generateBreadcrumbFragments: (nodeType) =>
    @linkTo = linkTo: 'material.things', label: 'All Things'
    if @redirectToDesign
      @linkTo = linkTo: 'material.design', label: 'Designer'
    @fragments = [@linkTo, {label: "Connect #{nodeType.name}"}]

angular.module('octobluApp').controller 'AddNodeWizardController', AddNodeWizardController
