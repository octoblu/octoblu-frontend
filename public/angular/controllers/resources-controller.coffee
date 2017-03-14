class ResourcesController
  constructor: ($scope, ResourceList) ->
    @scope = $scope
    @fullResourceList = ResourceList

    @scope.noResources = false

    @updateResources(@fullResourceList)

    @scope.$watch 'resourceSearch', (resourceSearch) =>
      resourceSearch = resourceSearch || ''
      filteredResources = _.filter @fullResourceList, (resource) =>
        title = (resource.title || '').toLowerCase()
        summary = (resource.summary || '').toLowerCase()
        search = resourceSearch.toLowerCase()
        return true if _.includes title, search
        return _.includes summary, search

      @updateResources(filteredResources)

  updateResources: (resources) =>
    if resources.length then @scope.noResources = false
    if !resources.length then @scope.noResources = true
    @scope.resources = resources
    @scope.resourcesList = _.groupBy(resources, 'category')


angular.module('octobluApp').controller 'ResourcesController', ResourcesController
