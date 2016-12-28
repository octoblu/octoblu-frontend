class UserSubscriptionService
  constructor: ($cookies, MeshbluHttpService) ->
    @MeshbluHttpService = MeshbluHttpService
    @subscriberUuid = $cookies.meshblu_auth_uuid
    @_createQueue()

  createSubscriptions: ({emitterUuid, types}, callback) =>
    async.each types, async.apply(@_addToQueue, emitterUuid), callback

  _createQueue: =>
    # only create the subscriptions one at a time
    @createSubscriptionQueue = async.queue (task, callback) =>
      @_refreshCache (error) =>
        @_logError 'refreshing user subscription cache', error
        @_invalidateCache()
        @_createSubscriptionForType task, (error) =>
          @_logError 'create subscription for type', error
          callback()

  _logError: (key, error) =>
    console.error "Error #{key}", error if error?

  _createSubscriptionForType: ({emitterUuid, type}, callback) =>
    return _.defer callback if @_subscriptionExists {emitterUuid, type}
    @MeshbluHttpService.createSubscription {@subscriberUuid, emitterUuid, type}, (error) =>
      return callback error if error?
      @subscriptions ?= []
      @subscriptions.push { @subscriberUuid, emitterUuid, type }
      callback()

  _subscriptionExists: ({emitterUuid, type}) =>
    _.find(@subscriptions, {emitterUuid, @subscriberUuid, type})?

  _addToQueue: (emitterUuid, type, callback) =>
    @createSubscriptionQueue.push {emitterUuid, type}, callback

  _refreshCache: (callback) =>
    return _.defer callback if @subscriptions?
    @MeshbluHttpService.listSubscriptions { @subscriberUuid }, (error, @subscriptions) =>
      callback error

  _invalidateCache: =>
    @timeout ?= setTimeout =>
      delete @subscriptions
      delete @timeout
    , 10000

angular.module('octobluApp').service 'UserSubscriptionService', UserSubscriptionService
