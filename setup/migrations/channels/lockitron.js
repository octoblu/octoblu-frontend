var record = {
  "application": {
    "base": "https://api.lockitron.com",
    "resources": [
      {
        "displayName": "/v2/locks",
        "doc": {
          "t": "Locks returns a list of the users available keys as well as data about those keys including their start and expiration times.",
          "url": "/docs"
        },
        "httpMethod": "GET",
        "params": [],
        "path": "/v2/locks"
      },
      {
        "displayName": "/v2/locks/:lock_id",
        "doc": {
          "t": "This method will lock or unlock the user's door. It blocks until locking/unlocking is finished. If the Lockitron is asleep, it can take several minutes. Failures return standard errors.",
          "url": "/v2/locks/{lock_id}/unlock"
        },
        "httpMethod": "PUT",
        "params": [
          {
            "name": ":lock_id",
            "required": true,
            "style": "query",
            "doc": {
              "t": "the id of the Lockitron to lock"
            }
          },
          {
            "name": "state",
            "required": true,
            "style": "body",
            "doc": {
              "t": "Possible states include: \"lock\", \"unlock\", or \"toggle\""
            }
          }
        ],
        "path": "/v2/locks/:lock_id"
      }
    ]
  },
  "auth_strategy": "oauth",
  "description" : "Lockitron lets you replace your keys with your phone.",
  "documentation": "https://api.lockitron.com/v2/docs",
  "enabled": true,
  "logo": "https://s3-us-west-2.amazonaws.com/octoblu-icons/lockitron.png",
  "logobw": "https://s3-us-west-2.amazonaws.com/octoblu-icons/lockitron-bw.png",
  "name": "Lockitron",
  "oauth": {
    "authTokenPath": "/oauth/token",
    "authTokenURL": "https://api.lockitron.com/oauth/authorize",
    "baseURL": "https://api.lockitron.com",

    // Production
    "clientId": "938cd6030161ec9bfc5c4e78e277762145f9b23d7caf3bb66a9333c034b6f9b1",
    "secret": "6a73aac43c7f1a25b5d5ce21d583d30f8278808e0faca81a5c8e34e885fb7c14",

    // Development
    // "clientId": "0b58a8b923eabf8c3ac9f8b19d9c5006198bb9aad8037a2e279eec6607668197",
    // "secret": "d8d36ebd7509e64ee35f63c21beea032564683121a4b6ef52fed18588266ad83",

    "scope": "",
    "tokenMethod": "access_token_query",
    "version": "2.0"
  },
  "useCustom": true
}

db     = db.getSiblingDB('meshines');

record = db.apis.findAndModify({
  query: {name: record.name},
  update: {
    $set: record
  },
  new: true,
  upsert: true
});

db.nodetypes.findAndModify({
  query: {name: record.name},
  update: {
    $set: {
      name: record.name,
      logo: record.logo,
      description: record.description,
      skynet: {
        subtype: record.name,
        type: "channel"
      },
      category: "channel",
      enabled: true,
      display: true,
      channel: record
    }
  },
  new: true,
  upsert: true
});

