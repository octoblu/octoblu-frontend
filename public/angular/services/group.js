'use strict';
angular.module('octobluApp')
    .service('GroupService', function ($http, OCTOBLU_API_URL) {

        this.addGroup = function (name) {
            return $http.post(OCTOBLU_API_URL + '/api/groups', {
                'name': name
            }).then(function (res) {
                return res.data;
            });
        };

        this.getGroup = function (group_uuid) {
            return $http.get(OCTOBLU_API_URL + '/api/groups/' + group_uuid)
                .then(function (res) {
                    return res.data;
                });
        };

        this.deleteGroup = function (group_uuid) {
            return $http.delete(OCTOBLU_API_URL + '/api/groups/' + group_uuid)
                .then(function (res) {
                    return res.data;
                });
        };

        this.updateGroup = function (updatedGroup) {
            return $http.put(OCTOBLU_API_URL + '/api/groups/' + updatedGroup.uuid, updatedGroup)
                .then(function (res) {
                    return res.data;
                });
        };

        this.getOperatorsGroup = function () {
            return $http.get(OCTOBLU_API_URL + '/api/groups/operators')
                .then(function (res) {
                    return res.data;
                });
        };

        this.getAllGroups = function (type) {
            var url = OCTOBLU_API_URL + '/api/groups';

            if (type) {
                url = url + '?type=' + type;
            }

            return $http.get(url)
                .then(function (res) {
                    return res.data;
                });
        };

        this.getGroupsContainingResource = function (resourceUUID) {
            var url = OCTOBLU_API_URL + '/api/groups/contain/' + resourceUUID;
            return $http.get(url)
                .then(function (res) {
                    return res.data;
                });
        };
    })
;
