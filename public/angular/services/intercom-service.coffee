class IntercomService
  constructor: (IntercomJSLoader, INTERCOM_APPID) ->
    @IntercomJSLoader = IntercomJSLoader
    @app_id = INTERCOM_APPID
    @IntercomJSLoader.load()

  boot: (user) =>
    @IntercomJSLoader.waitForIt =>
      Intercom 'boot', @convertUser user

  update: (user) =>
    @IntercomJSLoader.waitForIt =>
      Intercom 'update', @convertUser user

  convertUser: (user) =>
    return unless user?
    {
      email,
      created_at,
      name,
      user_id,
      unsubscribed_from_emails
    } = user

    return {
      @app_id,
      email,
      created_at: @convertDate(created_at),
      name,
      user_id,
      unsubscribed_from_emails: !!unsubscribed_from_emails,
    }

  convertDate: (date) =>
    moment(date).valueOf()

angular.module('octobluApp').service 'IntercomService', IntercomService
