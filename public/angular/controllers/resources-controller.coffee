class ResourcesController
  constructor: ($scope, ResourceList) ->
    @scope = $scope
    @fullResourceList = ResourceList

    @updateResources(@fullResourceList)

    @scope.$watch 'resourceSearch', (resourceSearch) =>
      resourceSearch = resourceSearch || ''
      filteredResources = _.filter @fullResourceList, (resource) =>
        title = (resource.title || '').toLowerCase()
        summary = (resource.summary || '').toLowerCase()
        search = resourceSearch.toLowerCase()
        return true if _.contains title, search
        return _.contains summary, search

      @updateResources(filteredResources)

  updateResources: (resources) =>
    @scope.resources = resources
    @scope.resourcesList = _.groupBy(resources, 'category')


angular.module('octobluApp').controller 'ResourcesController', ResourcesController
