angular.module('octobluApp').
    service('PermissionsService', function ($http, $q) {
        return {
            all: function (uuid, token) {
                return $http.get('/api/permissions', {
                    headers: {
                        'skynet_auth_uuid': uuid,
                        'skynet_auth_token': token
                    }
                }).then(function (res) {
                    return res.data;
                });
            },

            add: function (uuid, token, permission) {
                return $http({method: 'POST',
                    url: '/api/permissions',
                    data: permission,
                    headers: {
                        'skynet_auth_uuid': uuid,
                        'skynet_auth_token': token
                    }
                }).then(function (res) {
                    return res.data;
                });
            },

            allGroupPermissions: function (uuid, token) {
                return $http({method: 'GET', url: '/api/permissions/groups',
                    headers: {
                        'skynet_auth_uuid': uuid,
                        'skynet_auth_token': token
                    }
                }).then(function (res) {
                    return res.data;
                });
            },

            delete: function (uuid, token, resourceUUID) {
                return $http(
                    {method: 'DELETE',
                        url: '/api/permissions/' + resourceUUID,
                        headers: {
                            'skynet_auth_uuid': uuid,
                            'skynet_auth_token': token
                        }
                    }).then(function (res) {
                        return res.data;
                    });
            },
            update: function (uuid, token, permission) {
                return $http({method: 'PUT',
                    url: '/api/permissions/' + permission.resource.uuid,
                    data: permission,
                    headers: {
                        'skynet_auth_uuid': uuid,
                        'skynet_auth_token': token
                    }
                }).then(function (res) {
                    return res.data;
                });
            },
            allSourcePermissions : function(uuid, token, resourceUUID) {
                return $http({method: 'GET',
                    url: '/api/permissions/source/' + resourceUUID + '/compiled',
                    headers: {
                        'skynet_auth_uuid': uuid,
                        'skynet_auth_token': token
                    }
                }).then(function (res) {
                    return res.data;
                });
            },
            allTargetPermissions : function(uuid, token, resourceUUID) {
                return $http({method: 'GET',
                    url: '/api/permissions/target/' + resourceUUID + '/compiled',
                    headers: {
                        'skynet_auth_uuid': uuid,
                        'skynet_auth_token': token
                    }
                }).then(function (res) {
                    return res.data;
                });
            },
            flatSourcePermissions : function(uuid, token, resourceUUID) {
                return $http({method: 'GET',
                    url: '/api/permissions/source/' + resourceUUID + '/flat',
                    headers: {
                        'skynet_auth_uuid': uuid,
                        'skynet_auth_token': token
                    }
                }).then(function (res) {
                    return res.data;
                });
            },
            flatTargetPermissions : function(uuid, token, resourceUUID) {
                return $http({method: 'GET',
                    url: '/api/permissions/target/' + resourceUUID + '/flat',
                    headers: {
                        'skynet_auth_uuid': uuid,
                        'skynet_auth_token': token
                    }
                }).then(function (res) {
                    return res.data;
                });
            }
        }
    })
;
