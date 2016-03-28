class DocsGridController
  constructor: ($scope, ResourceList) ->
    @scope = $scope
    @scope.isLoading = false
    @scope.docs = @filterResources ResourceList

  filterResources: (resources) =>
    filteredResources = _.filter resources, 'featured'
    _.take filteredResources, @scope.limit if @scope.limit?


angular.module('octobluApp').controller 'DocsGridController', DocsGridController
