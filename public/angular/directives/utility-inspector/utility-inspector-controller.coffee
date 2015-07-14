class UtilityInspectorController
  constructor: ($scope, FlowNodeTypeService, NodeTypeService) ->
    @scope = $scope
    @scope.tab = {}
    @scope.things = []
    @scope.collectionViewStyle = 'list'
    @scope.viewSource = false
    @scope.loading = true

    @FlowNodeTypeService = FlowNodeTypeService
    @NodeTypeService     = NodeTypeService

    @toggleActiveTab 'things'

    @FlowNodeTypeService.getFlowNodeTypes()
      .then (flowNodeTypes) =>

    @NodeTypeService.getUnconfiguredNodeTypes().then (nodeTypes) =>
      @scope.loading = false
      @scope.things =  nodeTypes

    @scope.$watch 'thingNameFilter', (thingNameFilter) =>
      thingNameFilter = thingNameFilter || '';
      filteredThings = _.filter @scope.things, (thing) =>
        name = (thing.name || '').toLowerCase()
        thingNameFilter = thingNameFilter.toLowerCase();
        return _.contains name, thingNameFilter

      @updateThingsByCategory(filteredThings)

    @scope.$watch 'things', @updateThingsByCategory

  updateThingsByCategory: (things) =>
    console.log 'updateThingsByCategory:things', things
    
    @scope.noThings = !things.length
    @scope.thingsByCategory = _.groupBy things, (thing) =>
      return "Flows" if thing.type == "device:flow"
      thing.categories

    console.log 'updateThingsByCategory:thingsByCategory', @scope.thingsByCategory


  setCollectionViewStyle: (viewStyle) =>
    @scope.collectionViewStyle = viewStyle

  flowNodeTypeIsConfiguredNode: (node) =>
    node.category != 'operation' && node.type != 'device:flow'

  toggleViewSource: =>
    @scope.viewSource = !@scope.viewSource

  toggleActiveTab: (tabState) =>
    if tabState in ['things', 'tools', 'debug']
      @scope.tab.state = tabState
      @scope.thingNameFilter = '' if tabState == 'debug'
    else
      @scope.tab.state = undefined

angular.module('octobluApp').controller 'UtilityInspectorController', UtilityInspectorController
