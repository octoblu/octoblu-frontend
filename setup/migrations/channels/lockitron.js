var record = {
  "application": {
    "base": "https://api.lockitron.com",
    "resources": [
      {
        "displayName": "/v1/locks",
        "doc": {
          "t": "Locks returns a list of the users available keys as well as data about those keys including their start and expiration times.",
          "url": "/docs"
        },
        "httpMethod": "GET",
        "params": [],
        "path": "/v1/locks"
      },
      {
        "displayName": "/v1/locks/{lock_id}/unlock",
        "doc": {
          "t": "The unlock resource tells the specified Lockitron to unlock. It'll always return the status code 200 if you have access to the Lockitron. It'll then redirect you to a Log object for that resource. Within the Log object, result indicates whether or not it unlocked successfully and motion indicates whether you locked or unlocked the door. If you don't have access to the lock, it'll return a 403.",
          "url": "/v1/locks/{lock_id}/unlock"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "{lock_id}",
            "required": true,
            "style": "query",
            "doc": {
              "t": "the id of the Lockitron to lock"
            }
          }
        ],
        "path": "/v1/locks/{lock_id}/unlock"
      },
      {
        "displayName": "/v1/locks/{lock_id}/lock",
        "doc": {
          "t": "The lock resource tells the specified Lockitron to lock. It'll always return the status code 200 if you have access to the Lockitron. It'll then redirect you to a Log object for that resource. Within the Log object, result indicates whether or not it locked successfully and motion indicates whether you locked or unlocked the door. If you don't have access to the lock, it'll return a 403.",
          "url": "/v1/locks/{lock_id}/lock"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "{lock_id}",
            "required": true,
            "style": "query",
            "doc": {
              "t": "the id of the Lockitron to lock"
            }
          }
        ],
        "path": "/v1/locks/{lock_id}/lock"
      },
      {
        "displayName": "/v1/locks/{lock_id}/add",
        "doc": {
          "t": "The invite resource will invite a user by email to a lock. If they already have a Lockitron account, it'll add the key to it. Otherwise, it'll send them an invitation to email. This resource returns the user's Key object and a status code of 200. If it fails, it'll return a 500. If the user isn't allowed to invite guests, it'll return a 403. Note that only locks with text message access activated may use the phone argument alone to invite users.",
          "url": "/v1/locks/{lock_id}/add"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "{lock_id}",
            "required": true,
            "style": "query",
            "doc": {
              "t": "the id of the Lockitron to lock"
            }
          },
          {
            "name": "phone",
            "required": true,
            "style": "query",
            "doc": {
              "t": "the phone of the user to invite"
            }
          },
          {
            "name": "fullname",
            "required": false,
            "style": "query",
            "doc": {
              "t": "a suggested full name for the user being invited"
            }
          },
          {
            "name": "role",
            "required": false,
            "style": "query",
            "doc": {
              "t": "the desired role for the user - guest or admin"
            }
          },
          {
            "name": "start",
            "required": false,
            "style": "query",
            "doc": {
              "t": "the desired start time for the key as a Unix timestamp"
            }
          },
          {
            "name": "expiration",
            "required": false,
            "style": "query",
            "doc": {
              "t": "the desired expiration time for the key as a Unix timestamp"
            }
          }
        ],
        "path": "/v1/locks/{lock_id}/add"
      },
    ]
  },
  "auth_strategy": "oauth",
  "description" : "Lockitron lets you replace your keys with your phone.",
  "documentation": "https://api.lockitron.com/v1/docs",
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

