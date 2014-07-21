'use strict';

angular.module('octobluApp')
    .controller('addChannelOauthController', function($scope, $window, nodeType) {
        $scope.activate = function(){
            var url = '/api/auth/';

            if (nodeType.channel.owner || nodeType.channel.useCustom) {
                url = url + nodeType.channel._id + '/custom';
            } else {
                url = url + nodeType.channel.name;
            }

            $window.location.href = url;
        }
    });
