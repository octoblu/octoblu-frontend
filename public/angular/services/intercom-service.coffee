class IntercomService
  constructor: (IntercomJSLoader, INTERCOM_APPID) ->
    @IntercomJSLoader = IntercomJSLoader
    @app_id = INTERCOM_APPID
    @IntercomJSLoader.load()

  boot: ({ email, created_at, name, user_id, unsubscribed_from_emails }) =>
    @IntercomJSLoader.waitForIt =>
      Intercom 'boot', {
        @app_id,
        email,
        created_at,
        name,
        user_id,
        unsubscribed_from_emails,
      }

  update: (info) =>
    @IntercomJSLoader.waitForIt =>
      Intercom 'update', info

angular.module('octobluApp').service 'IntercomService', IntercomService
