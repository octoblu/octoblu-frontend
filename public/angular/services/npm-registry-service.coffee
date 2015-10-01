
class NPMRegistryService
  constructor: ($http, NPM_REGISTRY_API_URL) ->
    @http = $http
    @NPM_REGISTRY_API_URL = NPM_REGISTRY_API_URL

  getDependenciesForPackage: (packageName) =>
    console.log 'Boom!', packageName
    @http.get("#{@NPM_REGISTRY_API_URL}/#{packageName}", json: true).then  (response) =>
      console.log 'Response', response

angular.module('octobluApp').service 'NPMRegistryService', NPMRegistryService
