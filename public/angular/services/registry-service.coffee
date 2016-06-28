class RegistryService
  constructor: ($window, $q, $http, AuthService, DeviceLogo, OCTOBLU_CONNECTOR_OFFICIAL_REGISTRY) ->
    @window = $window
    @q = $q
    @http = $http
    @AuthService = AuthService
    @DeviceLogo = DeviceLogo
    @OCTOBLU_CONNECTOR_OFFICIAL_REGISTRY = OCTOBLU_CONNECTOR_OFFICIAL_REGISTRY
    @getRegistriesQueue = async.queue @_getRegistriesAndCache

  getRegistries: =>
    return @q.when @registries if @registries?

    return @q (resolve, reject) =>
      @getRegistriesQueue.push {}, (error) =>
        return reject error if error?
        resolve _.cloneDeep @registries

  _filterCollection: (items, key, search, exact) =>
    return _.filter items, (item) =>
      value = (item[key] || '').toLowerCase()
      return value == key if exact
      return _.contains value, search.toLowerCase()

  filterByName: (key, search, exact) =>
    return _.mapValues _.cloneDeep(@registries), (registrySet) =>
      return _.mapValues registrySet, (registry) =>
        registry.items = @_filterCollection registry.items, key, search, exact
        return registry

  getItem: ({ githubSlug, type }) =>
    found = null
    _.some _.values(@registries), (registrySet) =>
      return _.some registrySet, (registry) =>
        found = _.find registry.items, { githubSlug } if githubSlug?
        found = _.find registry.items, { type } if type?
        return true if found
    return found

  getItemFromDevice: (device) =>
    githubSlug = @getGithubSlugFromDevice device
    return @getItem { githubSlug, type: device.type }

  getGithubSlugFromDevice: (device) =>
    githubSlug = _.get device, 'connectorMetadata.githubSlug'
    return githubSlug if githubSlug?
    connector = _.get device, 'connector'
    return "octoblu/#{connector}" if connector?

  getDeviceUrl: (device) =>
    foundItem = @getItemFromDevice device
    return unless foundItem?
    return @parseUri foundItem.configureUri, device if device.uuid
    return @parseUri foundItem.createUri, device unless device.uuid

  parseUri: (uri, { uuid }) =>
    return uri.replace ':uuid', uuid

  hasItems: (registries) =>
    return _.some registries, (registrySet) =>
      return _.some _.values(registrySet), (registry) =>
        return !_.isEmpty(registry.items)

  _getRegistriesFromUser: (callback) =>
    @AuthService.getCurrentUser()
      .then (user) =>
        registries = user?.octoblu?.registries ? {}
        registries.connectors ?= {}
        registries.connectors['octoblu-official'] = {
          uri: @OCTOBLU_CONNECTOR_OFFICIAL_REGISTRY,
        }
        callback null, registries
      .catch (error) =>
        callback error
    return

  _mapItem: (node={}) =>
    node.logo = new @DeviceLogo(node).get()
    return node

  # 0.9 async.map doesn't handle mapping objects
  _mapObject: (object, fn, callback) =>
    values = _.values(object)
    keys = _.keys(object)
    async.map values, fn, (error, mappedValues) =>
      return callback error if error?
      finalObject = {}
      _.each keys, (key, i) =>
        finalObject[key] = mappedValues[i]
      callback null, finalObject

  _getRegistry: ({ uri }, callback) =>
    @http.get uri
      .then (response) =>
        return callback new Error('invalid response code') unless response.status == 200
        registry = response.data ? {}
        registry.items = _.map registry.items, @_mapItem
        callback null, registry
      .catch (error) =>
        callback error
    return

  _getRegistrySet: (registrySet, callback) =>
    @_mapObject registrySet, @_getRegistry, callback

  _getRegistriesAndCache: (task, callback) =>
    return callback() if @registries?
    @_getRegistriesFromUser (error, registries) =>
      @_mapObject registries, @_getRegistrySet, (error, @registries) =>
        return callback error if error?
        callback null

angular.module('octobluApp').service 'RegistryService', RegistryService
