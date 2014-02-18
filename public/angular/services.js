(function () {

	//userService
	var userService = function ($http) { 

		this.getUser = function(uuid, callback) {

			$http.get('/api/user/' + user)
			      .success(function(data) {
			        callback(data);
			      })
			      .error(function(data) {
			        console.log('Error: ' + data);
			      });

		};

		this.saveConnection = function(uuid, name, key, token, custom_tokens, callback) {

			$http.put('/api/user/' + uuid+ '/channel/' + name, {key: key, token: token, custom_tokens: custom_tokens})
			      .success(function(data) {
			        callback(data);
			      })
			      .error(function(data) {
			        console.log('Error: ' + data);
			      });

		};
	};
	userService.$inject = ['$http'];
    angular.module('e2eApp').service('userService', userService);

	//ownerService
	var ownerService = function ($http) { 

		this.getDevices = function(uuid, token, callback) {

			$http.get('/api/owner/devices/' + uuid + '/' + token)
			      .success(function(data) {
			        callback(data);
			      })
			      .error(function(data) {
			        console.log('Error: ' + data);
			      });

		};

    this.getGateways = function(uuid, token, callback) {

      $http.get('/api/owner/gateways/' + uuid + '/' + token)
            .success(function(data) {
              callback(data);
            })
            .error(function(data) {
              console.log('Error: ' + data);
              callback({});
            });

    };

	};
	ownerService.$inject = ['$http'];
    angular.module('e2eApp').service('ownerService', ownerService);

	//deviceService
	var deviceService = function ($http) { 

    this.getDevice = function(uuid, callback) {
      $http.get('/api/devices/' + uuid)                
              .success(function(data) {
                callback(data);   
              })
              .error(function(data) {
                console.log('Error: ' + data);
              });

    };

		this.createDevice = function(uuid, formData, callback) {

			$http.post('/api/devices/' + uuid, formData)                
	            .success(function(data) {
	              callback(data);   
	            })
	            .error(function(data) {
	              console.log('Error: ' + data);
	            });

		};

		this.updateDevice = function(uuid, formData, callback) {

			$http.put('/api/devices/' + uuid, formData)
	            .success(function(data) {
	              callback(data);	              
	            })
	            .error(function(data) {
	              console.log('Error: ' + data);
	            });

		};

		this.deleteDevice = function(uuid, token, callback) {

			$http.delete('/api/devices/' + uuid + '/' + token)
		        .success(function(data) {
		          callback(data);
		        })
		        .error(function(data) {
		          console.log('Error: ' + data);
		        });

		};

	};
    deviceService.$inject = ['$http'];
    angular.module('e2eApp').service('deviceService', deviceService);

	//messageService
	var messageService = function ($http) { 

    // TODO: Send via websockets so it adds fromUUID (your uuid)
		this.sendMessage = function(uuid, text, callback) {
			$http.post('/api/message/', {uuid: uuid, message: text})
	          .success(function(data) {
	            callback(data);
	            // $scope.messageOutput = data;
	          })
	          .error(function(data) {
	            console.log('Error: ' + data);
	          });
		};

	};
	
    messageService.$inject = ['$http'];
    angular.module('e2eApp').service('messageService', messageService);

	//nodeRedService
    var nodeRedService = function ($http) { 

    	this.getPort = function(uuid, token, callback) {

    		$http.get('/api/redport/' + uuid + '/' + token)
		      .success(function(data) {
		      	callback(data);
		        
		      })
		      .error(function(data) {
		        console.log('Error: ' + data);
		      });

    	};

    };
    nodeRedService.$inject = ['$http'];
    angular.module('e2eApp').service('nodeRedService', nodeRedService);

    //channelService
    var channelService = function ($http) { 

    	this.getList = function(callback) {

    		$http.get('/api/channels/', { cache: true})
		      .success(function(data) {
		      	callback(data);
		        
		      })
		      .error(function(data) {
		        console.log('Error: ' + data);
		      });

    	};

    	this.getByName = function(name, callback) {

    		$http.get('/api/channels/'+name, { cache: true})
		      .success(function(data) {
		      	callback(data);
		        
		      })
		      .error(function(data) {
		        console.log('Error: ' + data);
		      });

    	};

    };
    channelService.$inject = ['$http'];
    angular.module('e2eApp').service('channelService', channelService);

}());

