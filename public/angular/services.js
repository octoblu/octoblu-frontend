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
            });

    };

	};
	ownerService.$inject = ['$http'];
    angular.module('e2eApp').service('ownerService', ownerService);

	//deviceService
	var deviceService = function ($http) { 

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

    		var data = [
    			{ 'name': "One", "icon":"none", "description": "some details to display in tooltip 1", "enabled": true, "documentation": "", "base_url": "" }, 
    			{ 'name': "Two", "icon":"none", "description": "some details to display in tooltip 2", "enabled": true, "documentation": "", "base_url": "" },
    			{ 'name': "Three", "icon":"none", "description": "some details to display in tooltip 3", "enabled": true, "documentation": "", "base_url": "" },
    			{ 'name': "Four", "icon":"none", "description": "some details to display in tooltip 4", "enabled": true, "documentation": "", "base_url": "" },
    			{ 'name': "Five", "icon":"none", "description": "some details to display in tooltip 5", "enabled": true, "documentation": "", "base_url": "" },
    			{ 'name': "Six", "icon":"none", "description": "some details to display in tooltip 6", "enabled": true, "documentation": "", "base_url": "" },
    			{ 'name': "Seven", "icon":"none", "description": "some details to display in tooltip 7", "enabled": true, "documentation": "", "base_url": "" },
    			{ 'name': "Eight", "icon":"none", "description": "some details to display in tooltip 8", "enabled": true, "documentation": "", "base_url": "" },
    			{ 'name': "Nine", "icon":"none", "description": "some details to display in tooltip 9", "enabled": true, "documentation": "", "base_url": "" },
    			{ 'name': "Ten", "icon":"none", "description": "some details to display in tooltip 10", "enabled": true, "documentation": "", "base_url": "" },
    			{ 'name': "Eleven", "icon":"none", "description": "some details to display in tooltip 11", "enabled": true, "documentation": "", "base_url": "" },
    			{ 'name': "Twelve", "icon":"none", "description": "some details to display in tooltip 12", "enabled": true, "documentation": "", "base_url": "" },
    			{ 'name': "Thirteen", "icon":"none", "description": "some details to display in tooltip 13", "enabled": true, "documentation": "", "base_url": "" },
    			{ 'name': "Fourteen", "icon":"none", "description": "some details to display in tooltip 14", "enabled": true, "documentation": "", "base_url": "" },
    			{ 'name': "Fifteen", "icon":"none", "description": "some details to display in tooltip 15", "enabled": true, "documentation": "", "base_url": "" },
    			];
    		callback(data);

    	};

    };
    channelService.$inject = ['$http'];
    angular.module('e2eApp').service('channelService', channelService);

}());

