class UtilityInspectorController
  constructor: ($scope, RegistryService, NotifyService, FlowNodeTypeService, NodeTypeService) ->
    @scope = $scope
    @scope.tab = {}
    @scope.things = []
    @scope.viewSource = false
    @scope.loading = true
    @scope.paneCollapsed = false
    @scope.showCategory = true
    @scope.unreadDebug = false
    @scope.collectionViewStyle = 'list'

    @getPreferences()

    @FlowNodeTypeService = FlowNodeTypeService
    @NodeTypeService     = NodeTypeService
    @NotifyService       = NotifyService
    @RegistryService     = RegistryService

    @RegistryService.getRegistries()
      .then (registries) =>
        @scope.registries = registries
      , (error) =>
        @NotifyService.notifyError(error)

    @FlowNodeTypeService.getFlowNodeTypes()
      .then (flowNodeTypes) =>
        deviceFlows     = _.filter flowNodeTypes, type: 'device:flow'
        octobluFlows    = _.filter flowNodeTypes, type: 'octoblu:flow'
        connectedThings = _.filter flowNodeTypes, @flowNodeTypeIsConfiguredNode

        flows = _.union deviceFlows, octobluFlows
        @scope.things = _.union(@scope.things, connectedThings, flows)
        @scope.tools  = _.filter flowNodeTypes, category: 'operation'

    @NodeTypeService.getUnconfiguredNodeTypes().then (nodeTypes) =>
      @scope.things = _.union(@scope.things, nodeTypes)
      @scope.loading = false

    sanifyStr = (str='') =>
      return '' unless _.isString str
      return str.toLowerCase()

    @scope.$watch 'thingNameFilter', (thingNameFilter) =>
      filteredThings = _.filter @scope.things, ({ name }) =>
        return _.includes sanifyStr(name), sanifyStr(thingNameFilter)

      @scope.registries = @RegistryService.filterBy 'name', thingNameFilter
      @updateThingsByCategory(filteredThings)

    @scope.$watch 'things', @updateThingsByCategory

    @scope.$watch 'debug', (debug) =>
      return if @scope.unreadDebug
      return if @scope.tab.state == 'debug'
      return unless debug.length

      @scope.unreadDebug = true
    , true

  getPreferences: =>
    if localStorage.getItem 'octoblu.designer.sidebar.tools.collectionViewStyle'
      @scope.collectionViewStyle = localStorage.getItem 'octoblu.designer.sidebar.tools.collectionViewStyle'

    if localStorage.getItem 'octoblu.designer.sidebar.tools.active'
      @scope.tab.state = localStorage.getItem 'octoblu.designer.sidebar.tools.active'
    else
      @toggleActiveTab 'things'

  updateThingsByCategory: (things) =>
    @scope.noThings = !things.length
    @scope.thingsByCategory = _.groupBy things, (thing) =>
      return 'Flows' if thing.type == 'device:flow'
      return 'Flows' if thing.type == 'octoblu:flow'
      return 'Connected' if !thing.categories?
      thing.categories

    @scope.categories = _.sortBy(_.keys @scope.thingsByCategory)
    (_.pull @scope.categories, 'Connected').unshift 'Connected' if @scope.thingsByCategory['Connected']
    (_.pull @scope.categories, 'Flows').push 'Flows' if @scope.thingsByCategory['Flows']

  setCollectionViewStyle: (viewStyle) =>
    localStorage.setItem 'octoblu.designer.sidebar.tools.collectionViewStyle', viewStyle
    @scope.collectionViewStyle = viewStyle

  flowNodeTypeIsConfiguredNode: (node) =>
    return false if node.category == 'operation'
    return false if node.type == 'device:flow'
    return false if node.type == 'octoblu:flow'
    true

  toggleViewSource: =>
    @scope.viewSource = !@scope.viewSource

  toggleActiveTab: (tabState) =>
    @scope.thingNameFilter = ''
    if tabState in ['things', 'tools', 'debug']
      @scope.paneCollapsed = false
      localStorage.setItem 'octoblu.designer.sidebar.tools.active', tabState
      @scope.tab.state = tabState
      @scope.unreadDebug = false if tabState == 'debug'
    else
      @scope.tab.state = undefined

angular.module('octobluApp').controller 'UtilityInspectorController', UtilityInspectorController
