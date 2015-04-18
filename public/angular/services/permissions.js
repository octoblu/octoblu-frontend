'use strict';
angular.module('octobluApp').
    service('PermissionsService', function ($http, $q) {
        return {
            all: function (uuid, token) {
                return $http.get(OCTOBLU_API_URL + '/api/permissions').then(function (res) {
                    return res.data;
                });
            },

            add: function (permission) {
                return $http({method: 'POST',
                    url: OCTOBLU_API_URL + '/api/permissions',
                    data: permission
                }).then(function (res) {
                    return res.data;
                });
            },

            allGroupPermissions: function () {
                return $http({method: 'GET', url: OCTOBLU_API_URL + '/api/permissions/groups'})
                    .then(function (res) {
                        return res.data;
                    });
            },

            delete: function (resourceUUID) {
                return $http(
                    {method: 'DELETE',
                        url: OCTOBLU_API_URL + '/api/permissions/' + resourceUUID
                    }).then(function (res) {
                        return res.data;
                    });
            },
            update: function (permissionGroupTriple) {
                return $http({method: 'PUT',
                    url: OCTOBLU_API_URL + '/api/permissions/' + permissionGroupTriple.resourcePermission.resource.uuid,
                    data: permissionGroupTriple
                }).then(function (res) {
                    return res.data;
                });
            },
            allSourcePermissions: function (resourceUUID) {
                return $http({method: 'GET',
                    url: OCTOBLU_API_URL + '/api/permissions/source/' + resourceUUID + '/compiled'
                }).then(function (res) {
                    return res.data;
                });
            },
            allTargetPermissions: function (resourceUUID) {
                return $http({method: 'GET',
                    url: OCTOBLU_API_URL + '/api/permissions/target/' + resourceUUID + '/compiled'
                }).then(function (res) {
                    return res.data;
                });
            },
            flatSourcePermissions: function (resourceUUID) {
                return $http({method: 'GET',
                    url: OCTOBLU_API_URL + '/api/permissions/source/' + resourceUUID + '/flat'
                }).then(function (res) {
                    return res.data;
                });
            },
            flatTargetPermissions: function (resourceUUID) {
                return $http({method: 'GET',
                    url: OCTOBLU_API_URL + '/api/permissions/target/' + resourceUUID + '/flat'
                }).then(function (res) {
                    return res.data;
                });
            },
            getSharedResources: function (type) {
                return $http({method: 'GET',
                    url: OCTOBLU_API_URL + '/api/permissions/shared/' + (type || 'all')
                }).then(function (res) {
                    return res.data;
                });
            }
        }
    })
;
