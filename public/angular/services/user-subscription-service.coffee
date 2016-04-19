class UserSubscriptionService
  constructor: ($cookies, MeshbluHttpService) ->
    @MeshbluHttpService = MeshbluHttpService
    @subscriberUuid = $cookies.meshblu_auth_uuid
    # only fetch the subscriptions one time
    @refreshQueue = async.queue (task, callback) =>
      @_refreshCache callback

  createSubscriptions: ({emitterUuid, types}, callback) =>
    @refreshQueue.push {}, =>
      async.eachSeries types, async.apply @_createSubscriptionForType, emitterUuid

  _createSubscriptionForType: (emitterUuid, type, callback) =>
    return callback() if @_subscriptionExists {emitterUuid, type}
    @MeshbluHttpService.createSubscription {@subscriberUuid, emitterUuid, type}, (error) =>
      return callback error if error?
      delete @subscriptions
      callback()

  _subscriptionExists: ({emitterUuid, type}) =>
    _.find(@subscriptions, {emitterUuid, @subscriberUuid, type})?

  _refreshCache: (callback) =>
    return callback() if @subscriptions?
    @MeshbluHttpService.listSubscriptions {@subscriberUuid}, (error, @subscriptions) =>
      callback error

angular.module('octobluApp').service 'UserSubscriptionService', UserSubscriptionService
