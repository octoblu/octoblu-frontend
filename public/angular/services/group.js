angular.module('octobluApp')
    .service('GroupService', function ($cookies, $q, $http) {

        /**
         * Get a promise of the list of devices that belong to the owner.
         * @param owner
         * @returns {defer.promise|*} A promise that will resolve
         * to the list of devices owned by the owner, an empty list
         * if the owner owns no devices, or an error if there is an
         * error returned from the API call.
         */
        this.getAllDevices = function (uuid, token) {
            var defer = $q.defer();
            if (uuid && token) {
                $http.get('/api/owner/' + uuid + '/' + token + "/devices")
                    .success(function (data) {
                        defer.resolve(data);
                    })
                    .error(function (error) {
                        defer.reject(error);
                    });
            } else {
                defer.reject({
                    'error': 'Owner is null or undefined'
                });
            }
            return defer.promise;
        };


        /**
         * addGroup
         * @param name  - The name of the group - REQUIRED
         * @param uuid - The uuid of the group owner - REQUIRED
         * @param token - token of the group owner - REQUIRED
         * @param permissions - OPTIONAL
         * The permissions of the group. This object
         * will have properties corresponding to the permissions available [discover, configure, upgdate]
         *
         * @returns {defer.promise|*} A promise containing the result of the API call to add a new group
         * - i.e. /api/user/:uuid/:token/groups PUT
         *          data : {
         *             name : [name value]
         *             permissions : [permissions value]
         *          }
         */
        this.addGroup = function (name, uuid, token) {

            var defer = $q.defer();

            if (!(uuid && token)) {
                defer.reject({
                    'error': 'Missing uuid and/or token'
                });
            }

            if (!name) {
                defer.reject({
                    'error': 'Name is required'
                });
            } else {

                if (name.trim().length === 0) {
                    defer.reject({
                        'error': 'Name cannot be blank'
                    });
                }

                var url = '/api/groups';
                //Create the new group with the data
                //If no permissions have been set, use default permissions
                var groupData = {
                    'name': name
                };

                $http.post(url, groupData, {
                    headers: {
                        'ob_skynetuuid': uuid,
                        'ob_skynettoken': token
                    }
                }).success(function (group) {
                    defer.resolve(group);
                })
                    .error(function (result) {
                        defer.reject(result);
                    });
            }
            return defer.promise;
        };

        /**
         * Gets the group for the user
         * @param uuid
         * @param token
         * @param group_uuid
         * @returns {defer.promise|*}
         */
        this.getGroup = function (uuid, token, group_uuid) {
            var defer = $q.defer();
            if (!(uuid)) {
                defer.reject({
                    'error': 'Missing uuid and/or token'
                });
            }

            if (!group_uuid) {
                defer.reject({
                    'error': 'Missing required parameter: group uuid'
                });
            }

            var url = '/api/groups/' + group_uuid;
            $http.get(url, {
                headers: {
                    'ob_skynetuuid': uuid,
                    'ob_skynettoken': token
                }
            }).success(function (group) {
                defer.resolve(group);
            })
                .error(function (result) {
                    defer.reject(result);
                });

            return defer.promise;
        };

        /**
         * Makes a rest call to delete the Group
         *
         * @param uuid - the Group owner uuid
         * @param token - the Group owner token
         * @param group_uuid - The uuid of the group
         * @returns {defer.promise|*} a promise
         * that will contain the deleted group if successful
         * or an error.
         */
        this.deleteGroup = function (uuid, token, group_uuid) {
            var defer = $q.defer();
            if (!uuid || !token || !group_uuid) {
                defer.reject({
                    'error': 'missing required parameters'
                });
            } else {
                var url = '/api/groups/' + group_uuid;
                $http.delete(url, {
                    headers: {
                        'ob_skynetuuid': uuid,
                        'ob_skynettoken': token
                    }
                }).success(function (group) {
                    defer.resolve(group);
                }).error(function (result) {
                    defer.reject(result);
                });
            }
            return defer.promise;
        };

        /**
         * HTTP VERB : PUT
         *
         * updateGroup saves the modified group
         * @param uuid - the owner UUID
         * @param token - the owner token
         * @param updatedGroup - the modified group
         * @returns {defer.promise|*} a promise that will eventually
         * be the modified group on success or error if the group could not be saved
         * successfully
         */
        this.updateGroup = function (uuid, token, updatedGroup) {

            var defer = $q.defer();
            if (!uuid || !token || !updatedGroup) {
                defer.reject({
                    'error': 'missing required parameters'
                });
            } else {
                var url = '/api/groups/' + updatedGroup.uuid;
                $http.put(url,
                    updatedGroup,
                    {
                        headers: {
                            'ob_skynetuuid': uuid,
                            'ob_skynettoken': token
                        }
                    }).success(function (result) {
                        defer.resolve(result)
                    }).error(function (result) {
                        defer.reject(result);
                    });
            }
            return defer.promise;
        };

        this.getOperatorsGroup = function (uuid, token) {
            return $http.get('/api/groups/operators', {
                headers: {
                    'ob_skynetuuid': uuid,
                    'ob_skynettoken': token
                }
            }).then(function (res) {
                return res.data;
            });
        };

        this.getAllGroups = function (uuid, token, type) {
            var defer = $q.defer();
            if (!uuid || !token) {
                defer.reject({
                    'error': 'missing required parameters'
                });
            } else {

                var url = '/api/groups';

                if (type) {
                    url = url + '?type=' + type;
                }

                $http.get(url, {
                    headers: {
                        'ob_skynetuuid': uuid,
                        'ob_skynettoken': token
                    }
                }).success(function (group) {
                    defer.resolve(group)
                }).error(function (result) {
                    defer.reject(result);
                });
            }
            return defer.promise;
        };
    });

