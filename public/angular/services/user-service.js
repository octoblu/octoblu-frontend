'use strict';
angular.module('octobluApp')
.service('userService', function ($http, $q, MeshbluHttpService, OCTOBLU_API_URL) {
var self = this;
self.activateNoAuthChannel = function(user, channelid, callback) {
  $http.put(OCTOBLU_API_URL + '/api/user/' + user + '/activate/' + channelid)
  .success(function(data) {
    callback(null, data);
  })
  .error(function(error) {
    console.error(error);
    callback(error);
  });
};

self.activateNoAuthChannelByType = function(user, channeltype, callback) {
  $http.put(OCTOBLU_API_URL + '/api/user/' + user + '/activate/' + channeltype + '/type')
  .success(function(data) {
    callback(null, data);
  })
  .error(function(error) {
    console.error(error);
    callback(error);
  });
};

self.saveAWSApi = function (uuid, channelid, username, password, callback) {

  $http.post(OCTOBLU_API_URL + '/api/channel/aws/channel/' + channelid, { username: username, password: password })
  .success(function (data) {
    callback(data);
  })
  .error(function (data) {
    console.log('Error: ' + data);
    callback({});
  });

};

self.savePagerdutyApi = function (channelId, token, callback) {
  $http.post(OCTOBLU_API_URL + '/api/channel/pagerduty/channel/' + channelId, {token: token})
  .success(function (data) {
    callback(data);
  })
  .error(function (data) {
    console.log('Error: ' + data);
    callback({});
  });
};

self.saveGooglePlacesApi = function(uuid, channelid, apikey, callback) {
  $http.post(OCTOBLU_API_URL + '/api/channel/google-places/channel/' + channelid, { apikey: apikey })
  .success(function (data) {
    callback(data);
  })
  .error(function (data) {
    console.error('Error: ' + data);
    callback({});
  });
};

self.saveBasicApi = function (uuid, channelid, username, password, callback) {
  $http.post(OCTOBLU_API_URL + '/api/channel/basic/channel/' + channelid, { username: username, password: password })
  .success(function (data) {
    callback(null, data);
  })
  .error(function (error) {
    console.error(error);
    callback(error);
  });

};

self.saveMeshbluApi = function (channelid, uuid, callback) {
  MeshbluHttpService.generateAndStoreToken(uuid, { tag: channelid }, function(error, result) {
    if (error) {
      return callback(error)
    }
    result = result || {};
    var token = result.token;
    self.saveBasicApi(uuid, channelid, uuid, token, callback)
  })
};

self.saveApiKey = function(channelid, apikey, callback){
  $http.post(OCTOBLU_API_URL + '/api/channel/apikey/channel/' + channelid, {apikey: apikey})
  .success(function(data){
    callback(data);
  })
  .error(function(error){
    console.error('Error: ', error);
  });
};

self.saveSimpleAuthQuery = function(channelid, userId, password, domain, appKey, callback){
  $http.post(OCTOBLU_API_URL + '/api/channel/simpleauthquery/channel/' + channelid, {
      userId : userId,
      domain : domain,
      password : password,
      appKey : appKey})
  .success(function(data){
    callback(data);
  })
  .error(function(error){
    console.error('Error: ', error);
  });
};

self.saveConnection = function (uuid, channelid, key, token, custom_tokens, callback, defaultParams, defaultHeaderParams) {
  $http.put(OCTOBLU_API_URL + '/api/user/' + uuid+ '/channel/' + channelid,
  	{ key: key, token: token, custom_tokens: custom_tokens, defaultParams : defaultParams, defaultHeaderParams: defaultHeaderParams})
  .success(function (data) {
    callback(data);
  })
  .error(function (data) {
    console.log('Error: ' + data);
    callback({});
  });
};

self.removeConnection = function (channelid) {
  return $http.delete(OCTOBLU_API_URL + '/api/user/channel/' + channelid);
};

});
