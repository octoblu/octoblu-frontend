angular.module('e2eApp')
    .service('userService', function ($http) {
        this.getUser = function(uuid, callback) {

            $http.get('/api/user/' + user)
                .success(function(data) {
                    callback(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback({});
                });

        };

        this.saveConnection = function(uuid, name, key, token, custom_tokens, callback) {

            $http.put('/api/user/' + uuid+ '/channel/' + name, {key: key, token: token, custom_tokens: custom_tokens})
                .success(function(data) {
                    callback(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback({});
                });

        };

        this.removeConnection = function(uuid, name, callback) {

            $http.delete('/api/user/' + uuid+ '/channel/' + name, {} )
                .success(function(data) {
                    callback(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback({});
                });

        };
    })
    .service('ownerService', function ($http) {
        this.getDevices = function(uuid, token, callback) {

            $http.get('/api/owner/devices/' + uuid + '/' + token)
                .success(function(data) {
                    callback(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback({});
                });

        };

        this.getGateways = function(uuid, token, includeDevices, callback) {
            // $http.get('/api/owner/gateways/' + uuid + '/' + token)
            $http({
                url: '/api/owner/gateways/' + uuid + '/' + token,
                method: 'get',
                params: {
                    devices: includeDevices
                }
            }).success(function(data) {
                callback(data);
            })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback({});
                });

        };
	})
    .service('deviceService', function ($http) {
        this.getDevice = function(uuid, callback) {
            $http.get('/api/devices/' + uuid)
                .success(function(data) {
                    callback(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback({});
                });

        };

        this.createDevice = function(uuid, formData, callback) {

            $http.post('/api/devices/' + uuid, formData)
                .success(function(data) {
                    callback(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback({});
                });

        };

        this.updateDevice = function(uuid, formData, callback) {

            $http.put('/api/devices/' + uuid, formData)
                .success(function(data) {
                    callback(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback({});
                });

        };

        this.deleteDevice = function(uuid, token, callback) {

            $http.delete('/api/devices/' + uuid + '/' + token)
                .success(function(data) {
                    callback(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback({});
                });

        };
	})
    .service('messageService', function ($http) {
        // TODO: Send via websockets so it adds fromUUID (your uuid)
		this.sendMessage = function(uuid, text, callback) {
			$http.post('/api/message/', {uuid: uuid, message: text})
	          .success(function(data) {
	            callback(data);
	            // $scope.messageOutput = data;
	          })
	          .error(function(data) {
	            console.log('Error: ' + data);
              callback({});
	          });
		};
	})
    .service('nodeRedService', function ($http) {

    	this.getPort = function(uuid, token, callback) {

    		$http.get('/api/redport/' + uuid + '/' + token)
		      .success(function(data) {
		      	callback(data);
		        
		      })
		      .error(function(data) {
		        console.log('Error: ' + data);
            callback({});
		      });

    	};

    })
    .service('channelService', function ($http) {
    	this.getList = function(callback) {
    		$http.get('/api/channels/', { cache: true})
		      .success(function(data) { callback(data); })
		      .error(function(data) {
		        console.log('Error: ' + data);
            	callback({});
		      });
    	};

    	this.getActive = function(uuid, callback) {
    		$http.get('/api/channels/'+uuid+'/active', { cache: false})
		      .success(function(data) { callback(data); })
		      .error(function(data) {
		        console.log('Error: ' + data);
            	callback({});
		      });
    	};

    	this.getAvailable = function(uuid, callback) {
    		$http.get('/api/channels/'+uuid+'/available', { cache: false})
		      .success(function(data) { callback(data); })
		      .error(function(data) {
		        console.log('Error: ' + data);
            	callback({});
		      });
    	};

    	this.getCustomList = function(uuid, callback) {
    		$http.get('/api/customchannels/' + uuid, { cache: true})
		      .success(function(data) { callback(data); })
		      .error(function(data) {
		        console.log('Error: ' + data);
            	callback({});
		      });
    	};

    	this.getByName = function(name, callback) {
    		$http.get('/api/channels/'+name, { cache: true})
		      .success(function(data) {
		      	callback(data);
		      })
		      .error(function(data) {
		        console.log('Error: ' + data);
            	callback({});
		      });
    	};

    	this.save = function(channel, callback) {
    		var d = angular.toJson(channel);
    		$http.put('/api/channels/', d, { cache: true})
		      .success(function(data) {
		      	callback(data);
		      })
		      .error(function(data) {
		        console.log('Error: ' + data);
            	callback({});
		      });
    	};
    });