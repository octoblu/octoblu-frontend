angular.module('octobluApp')
    .factory('GroupService' , function($cookies, $q, $resource ){

        /**
          this gets All the People that the
          user has invited to Octoblu (Part of the Operators Group)
          and that are members of the operators group
         */
        this.getAllPeople  = function(owner){
            /*
              PPP:
               Get all the Invitations that are pending
               Get all the Operator Group members
             */

        };

        /**
         *
         * @param owner
         */
        this.getAllDevices = function(owner){

        };

        /**
         *
         * @param owner
         */
        this.getAllGroups = function(owner){

        };

        /**
         *
         * @param owner - An object consisting of a UUID and token property that belong
         * to the owner of the group.
         * @param groupuuid - The UUID of
         *
         */
        this.getGroup = function(owner, groupuuid ){

        };

        /**
         *
         * @param owner - An object consisting of a UUID and token property that belong
         * @param name - The name of the new Group, cannot be empty or
         */
        this.addGroup = function(owner, name ){

        };

        /**
         *
         * @param owner - An object consisting of a UUID and token property that belong
         * to the owner of the group.
         * @param group - The group to delete
         */
        this.deleteGroup = function( owner, group ){

        };

        /**
         *
         * @param owner - An object consisting of a UUID and token property that belong
         * to the owner of the group.
         * @param group
         * @return
         */
        this.updateGroup = function(owner, group ){

        };
    });

