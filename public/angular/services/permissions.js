angular.module('octobluApp').
    service('PermissionsService', function ($http, $q) {
        return {
            all: function (uuid, token) {
                return $http.get('/api/permissions', {
                    headers: {
                        'ob_skynetuuid': uuid,
                        'ob_skynettoken': token
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
                        'ob_skynetuuid': uuid,
                        'ob_skynettoken': token
                    }
                }).then(function (res) {
                    return res.data;
                });
            },

            allGroupPermissions: function (uuid, token) {
                return $http({method: 'GET', url: '/api/permissions/groups',
                    headers: {
                        'ob_skynetuuid': uuid,
                        'ob_skynettoken': token
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
                            'ob_skynetuuid': uuid,
                            'ob_skynettoken': token
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
                        'ob_skynetuuid': uuid,
                        'ob_skynettoken': token
                    }
                }).then(function (res) {
                    return res.data;
                });
            }
        }
    })
;
