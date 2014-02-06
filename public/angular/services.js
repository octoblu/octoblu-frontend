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

			$http.get('/api/owner/' + uuid + '/' + token)
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

			$http.put('/api/devices/' + uuid, formData)                
	            .success(function(data) {
	              callback(data);   
	            })
	            .error(function(data) {
	              console.log('Error: ' + data);
	            });

		};

		this.updateDevice = function(uuid, formData, callback) {

			$http.post('/api/devices/' + uuid, formData)
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
    			{ 'name': "One", "icon":"none", "description": "description", "details":"details" }, 
    			{ 'name': "Two", "icon":"none", "description": "description", "details":"details" },
    			{ 'name': "Three", "icon":"none", "description": "description", "details":"details" },
    			{ 'name': "Four", "icon":"none", "description": "description", "details":"details" },
    			{ 'name': "Five", "icon":"none", "description": "description", "details":"details" },
    			{ 'name': "Six", "icon":"none", "description": "description", "details":"details" },
    			{ 'name': "Seven", "icon":"none", "description": "description", "details":"details" },
    			{ 'name': "Eight", "icon":"none", "description": "description", "details":"details" },
    			{ 'name': "Nine", "icon":"none", "description": "description", "details":"details" },
    			{ 'name': "Ten", "icon":"none", "description": "description", "details":"details" },
    			{ 'name': "Eleven", "icon":"none", "description": "description", "details":"details" },
    			{ 'name': "Twelve", "icon":"none", "description": "description", "details":"details" },
    			{ 'name': "Thirteen", "icon":"none", "description": "description", "details":"details" },
    			{ 'name': "Fourteen", "icon":"none", "description": "description", "details":"details" },
    			{ 'name': "Fifteen", "icon":"none", "description": "description", "details":"details" },
    			];
    		callback(data);

    	};

    };
    channelService.$inject = ['$http'];
    angular.module('e2eApp').service('channelService', channelService);

}());

