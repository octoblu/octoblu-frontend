angular.module('octobluApp')
    .service('GroupService' , function($cookies, $q, $http, userService ){

        /**
         * getAllPeople returns a promise of the members of the users Operators group
         *
         * @param user
         * @returns {defer.promise|*}
         */
        this.getAllPeople  = function( user ){
            var defer = $q.defer();
            var operatorsGroup = _.findWhere(user.groups, { 'type' : 'Operators'});
            if( operatorsGroup ){
                $http.get('/api/group/' + operatorsGroup.uuid + '/members')
                    .success(function(members){
                       defer.resolve(members);
                    })
                    .error(function(error){
                        defer.reject(error);
                    });
            } else {
                defer.resolve([]);
            }
            return defer.promise;
        };

        /**
         * Gets the user info for a groups members.
         * @param group
         * @returns {defer.promise|*}
         */
        this.getGroupMembers = function(group){

            var defer = $q.defer();
            if( group ){
                $http.get('/api/group/' + group.uuid + '/members')
                    .success(function(members){
                        defer.resolve(members);
                    })
                    .error(function(error){
                        defer.reject(error);
                    });
            } else {
                defer.resolve([]);
            }
            return defer.promise;

        };

        /**
         * Get a promise of the list of devices that belong to the owner.
         * @param owner
         * @returns {defer.promise|*} A promise that will resolve
         * to the list of devices owned by the owner, an empty list
         * if the owner owns no devices, or an error if there is an
         * error returned from the API call.
         */
        this.getAllDevices = function(owner){
            var defer = $q.defer();
            if( owner ){
                $http.get('/api/owner/devices/' + uuid + '/' + token)
                    .success(function(data) {
                        if( data.devices ){
                            defer.resolve(data.devices);
                        } else {
                            defer.resolve([]);
                        }
                    })
                    .error(function(error) {
                       defer.reject(error);
                    });
            } else {
                defer.reject({
                    'error' : 'Owner is null or undefined'
                });
            }
            return defer.promise;
        };


        /**
         *
         * @param owner
         * @param name
         * @returns {defer.promise|*}
         */
        this.addGroup = function(owner, name ){
            var defer = $q.defer();

            return defer.promise;
        };


        this.deleteGroup = function( owner, group ){
            var defer = $q.defer();

            return defer.promise;
        };

        /**
         *
         * @param newMember
         * @param user
         * @param group
         * @returns {defer.promise|*}
         */
        this.addMembersToGroup = function(members , user, group){
            var defer = $q.defer();

            return defer.promise;
        }

    });

