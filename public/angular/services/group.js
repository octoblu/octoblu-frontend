angular.module('octobluApp')
    .service('GroupService', function ($http) {

        this.addGroup = function (name) {
            return $http.post('/api/groups', {
                'name': name
            }).then(function (res) {
                return res.data;
            });
        };

        this.getGroup = function (group_uuid) {
            return $http.get('/api/groups/' + group_uuid)
                .then(function (res) {
                    return res.data;
                });
        };
        this.deleteGroup = function (group_uuid) {
            return $http.delete('/api/groups/' + group_uuid)
                .then(function (res) {
                    return res.data;
                });
        };
        this.updateGroup = function (updatedGroup) {
            return $http.put('/api/groups/' + updatedGroup.uuid, updatedGroup)
                .then(function (res) {
                    return res.data;
                });
        };

        this.getOperatorsGroup = function () {
            return $http.get('/api/groups/operators')
                .then(function (res) {
                    return res.data;
                });
        };

        this.getAllGroups = function (type) {
            var url = '/api/groups';

            if (type) {
                url = url + '?type=' + type;
            }

            return $http.get(url)
                .then(function (res) {
                    return res.data;
                });
        };
        this.getGroupsContainingResource = function (resourceUUID) {
            var url = '/api/groups/contain/' + resourceUUID;
            return $http.get(url)
                .then(function (res) {
                    return res.data;
                });
        };
    })
;

