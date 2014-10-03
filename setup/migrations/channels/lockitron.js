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
            "style": "url",
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
    "development": {
      "authTokenPath": "/oauth/token",
      "authTokenURL": "https://api.lockitron.com/oauth/authorize",
      "baseURL": "https://api.lockitron.com",
      "clientId": "59e9b56517291cf40a87d3a60a5feb4febe402983e60c528182d32ee23b8576e",
      "secret": "ada2e03c69fdf4fb404098a5bb884fb83881912c4f28d52bf83c07ed8b42ae2f",
      "scope": "",
      "tokenMethod": "access_token_query",
      "version": "2.0"
    },
    "production": {
      "authTokenPath": "/oauth/token",
      "authTokenURL": "https://api.lockitron.com/oauth/authorize",
      "baseURL": "https://api.lockitron.com",
      "clientId": "47386cc5bb78cfb3d785904a3c82bbaaf39f50ea24119d43c692313292b23ea0",
      "secret": "40f69716b8eb3bced057220dbe1c7bf3bc9d55b8eed538be78ecfe94dcdc4c61",
      "scope": "",
      "tokenMethod": "access_token_query",
      "version": "2.0"
    },
    "staging": {
      "authTokenPath": "/oauth/token",
      "authTokenURL": "https://api.lockitron.com/oauth/authorize",
      "baseURL": "https://api.lockitron.com",
      "clientId": "78c93f5c1f5467b74b5736997eb8a73881ecc4dafacf20563b8c83290f85c5e0",
      "secret": "21e255ba632c8c54ce8201fa049261f7db986b0ac110d2f9f6f97f4eb4e7896f",
      "scope": "",
      "tokenMethod": "access_token_query",
      "version": "2.0"
    }
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

