class UserSubscriptionService
  constructor: ($cookies, MeshbluHttpService) ->
    @MeshbluHttpService = MeshbluHttpService
    @subscriberUuid = $cookies.meshblu_auth_uuid
    # only create the subscriptions one at a time
    @createSubscriptionQueue = async.queue (task, callback) =>
      @_refreshCache =>
        @_createSubscriptionForType task, callback

  createSubscriptions: ({emitterUuid, types}, callback) =>
    async.each types, async.apply(@_addToQueue, emitterUuid), callback

  _createSubscriptionForType: ({emitterUuid, type}, callback) =>
    return callback() if @_subscriptionExists {emitterUuid, type}
    @MeshbluHttpService.createSubscription {@subscriberUuid, emitterUuid, type}, (error) =>
      return callback error if error?
      delete @subscriptions
      callback()

  _subscriptionExists: ({emitterUuid, type}) =>
    _.find(@subscriptions, {emitterUuid, @subscriberUuid, type})?

  _addToQueue: (emitterUuid, type, callback) =>
    @createSubscriptionQueue.push {emitterUuid, type}, callback

  _refreshCache: (callback) =>
    return callback() if @subscriptions?
    @MeshbluHttpService.listSubscriptions {@subscriberUuid}, (error, @subscriptions) =>
      callback error

angular.module('octobluApp').service 'UserSubscriptionService', UserSubscriptionService
