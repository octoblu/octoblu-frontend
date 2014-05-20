angular.module('octobluApp')
    .service('messageService', function ($http) {
        // TODO: Send via websockets so it adds fromUUID (your uuid)
        this.sendMessage = function(fromUuid, fromToken, toUuid, text, callback) {
            $http.post('/api/message/', {fromUuid: fromUuid, fromToken: fromToken, toUuid: toUuid, message: text})
                .success(function(data) {
                    callback(data);
                    // $scope.messageOutput = data;
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback({});
                });
        };
    });
