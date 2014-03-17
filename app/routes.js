module.exports = function(app, passport) {
  // Import models
	var User    = require('./models/user');
	var Api     = require('./models/api');

  // Setup config

	// var config = require('../config/auth.js');
	var env      = app.settings.env;
	var config = require('../config/auth.js')(env);
	var request = require('request');
	var async = require('async');
	var skynet = require('skynet');

	console.log('Connecting to SkyNet...');
	// Generic UUID / Token for SkyNet API calls
	var conn = skynet.createConnection({
	  "uuid": "9b47c2f1-9d9b-11e3-a443-ab1cdce04787",
	  "token": "pxdq6kdnf74iy66rhuvdw9h5d2f0f6r",
	  "protocol": "websocket"
	});

	conn.on('notReady', function(data){
		console.log('SkyNet authentication: failed');
	});

  // Attach additional routes
	conn.on('ready', function(data){
		console.log('SkyNet authentication: success');

	  // Initialize Controllers
    require('./controllers/cors')(app);
    require('./controllers/session')(app, passport, config);
    require('./controllers/oauth')(app, passport, config);
    require('./controllers/connect')(app, passport, config);
    require('./controllers/unlink')(app);

		// APIs
		// Get user
		app.get('/api/user/:id', function(req, res) {

		    User.findOne({ $or: [
		    	{"local.skynetuuid" : req.params.id},
		    	{"twitter.skynetuuid" : req.params.id},
		    	{"facebook.skynetuuid" : req.params.id},
		    	{"google.skynetuuid" : req.params.id}
		    	]
		    }, function(err, userInfo) {
		    	// console.log(userInfo);
		      if (err) {
		        res.send(err);
		      } else {
		      	// not sure why local.password cannot be deleted from user object
		      	// if (userInfo && userInfo.local){
			      // 	userInfo.local.password = null;
			      // 	delete userInfo.local.password;
		      	// }
		        res.json(userInfo);
		      }
		    });
		});

		// // Get devices by owner
		// app.get('/api/owner/devices/:id/:token', function(req, res) {

		// 	request.get('http://skynet.im/mydevices/' + req.params.id,
		//   	{qs: {"token": req.params.token}}
		//   , function (error, response, body) {
		//   		try{
		// 				data = JSON.parse(body);
		// 			} catch(e){
		// 				data = {};
		// 			}
		//     	res.json(data);
		// 	});
		// });

		// APIs
		// Get user
		app.get('/api/user/:id', function(req, res) {

		    User.findOne({ $or: [
		    	{"local.skynetuuid" : req.params.id},
		    	{"twitter.skynetuuid" : req.params.id},
		    	{"facebook.skynetuuid" : req.params.id},
		    	{"google.skynetuuid" : req.params.id}
		    	]
		    }, function(err, userInfo) {
		    	// console.log(userInfo);
		      if (err) {
		        res.send(err);
		      } else {
		      	// not sure why local.password cannot be deleted from user object
		      	// if (userInfo && userInfo.local){
			      // 	userInfo.local.password = null;
			      // 	delete userInfo.local.password;
		      	// }
		        res.json(userInfo);
		      }
		    });
		});

		// Get devices by owner
		app.get('/api/owner/devices/:id/:token', function(req, res) {

			// request.get('http://skynet.im/devices',
		 //  	{qs: {"owner": req.params.id}}
		 //  , function (error, response, body) {
			// 		data = JSON.parse(body);
		 //    	res.json(data);
			// });

			request.get('http://skynet.im/mydevices/' + req.params.id,
		  	{qs: {"token": req.params.token}}
		  , function (error, response, body) {
		  		try{
						data = JSON.parse(body);
					} catch(e){
						data = {};
					}
		    	res.json(data);
			});


		});

		// Get devices by owner
		app.get('/api/owner/gateways/:id/:token', function(req, res) {
			console.log('Return Devices? ', req.query.devices);
			request.get('http://skynet.im/mydevices/' + req.params.id,
		  	{qs: {"token": req.params.token}}
		  , function (error, response, body) {
					myDevices = JSON.parse(body);
					myDevices = myDevices.devices
					console.log(myDevices);
					var gateways = []
					for (var i in myDevices) {
						if(req.query.devices == 'true'){
							gateways.push(myDevices[i]);
						} else {
							if(myDevices[i].type == 'gateway'){
								gateways.push(myDevices[i]);
							}

						}
					}
					console.log(gateways);
					request.get('http://skynet.im/devices',
				  	{qs: {"ipAddress": req.ip, "type":"gateway", "owner" : { "$exists" : false } }}
				  , function (error, response, body) {
				  		ipDevices = JSON.parse(body);
				  		devices = ipDevices.devices

					console.log('local gateways',devices);

			  			// if(devices) {
			  			if(true) {
			  				if (devices){
			  					devicesLength = devices.length;
			  				} else {
			  					devicesLength = 0;
			  				}
								async.times(devicesLength, function(n, next){

									request.get('http://skynet.im/devices/' + devices[n]
								  , function (error, response, body) {
											data = JSON.parse(body);
											console.log(data);
											var dupeFound = false;
											console.log('looping', gateways);

											for (var i in gateways) {
												if(gateways[i].uuid == data.uuid){
													dupeFound = true;
												}
											}
											if(!dupeFound){
												gateways.push(data);
											}
											next(error, gateways);
									});


								}, function(err) {
									console.log(gateways);
									console.log('==>gateways', gateways);
									// gateways = gateways[0];
										// console.log('gateways plugins check');

				  				if (gateways){
				  					gatewaysLength = gateways.length;
				  				} else {
				  					gatewaysLength = 0;
				  				}

									// Lookup plugins on each gateway
									async.times(gatewaysLength, function(n, next){
							      conn.gatewayConfig({
							        "uuid": gateways[n].uuid,
							        "token": gateways[n].token,
							        "method": "getPlugins"
							      }, function (plugins) {
							      	console.log('plugins:', plugins.result);
							        gateways[n].plugins = plugins.result;
											next(error, gateways[n]);
										});

							    }, function(err, gateways) {

										// console.log('gateways subdevices check');

										// Lookup subdevices on each gateway
										async.times(gateways.length, function(n, next){
								      conn.gatewayConfig({
								        "uuid": gateways[n].uuid,
								        "token": gateways[n].token,
								        "method": "getSubdevices"
								      }, function (subdevices) {
								      	console.log('==>subdevices:', subdevices.result);
								        gateways[n].subdevices = subdevices.result;
												next(error, gateways[n]);
											});

								    }, function(err, gateways) {
								    	console.log('gateways result', gateways);
											res.json({"gateways": gateways});
										});

									});

							})


						} else {
							res.json({"gateways": gateways});
						}
					});

			});

		});



		// Get nodered port
		app.get('/api/redport/:uuid/:token', function(req, res) {
			// curl -X PUT http://red.meshines.com:4444/red/aaa?token=bbb
			request.put('http://designer.octoblu.com:4444/red/' + req.params.uuid,
		  	{qs: {"token": req.params.token}}
		  , function (error, response, body) {
					// console.log(body);
		    	res.json(body);
			});
		});

		// Get device info from Skynet
		app.get('/api/devices/:id', function(req, res) {

			request.get('http://skynet.im/devices/' + req.params.id
		  , function (error, response, body) {
					data = JSON.parse(body);
		    	res.json(data);
			});

		});


		// Register device with Skynet
		app.post('/api/devices/:id', function(req, res) {
			// console.log(req);

			var deviceData = {};
			deviceData.owner = req.params.id;
			deviceData.name = req.body.name;

			// flatten array
			var obj = req.body.keyvals;
			for (var i in obj) {
			  deviceData[obj[i]["key"]] = obj[i]["value"];
			}

			request.post('http://skynet.im/devices',
		  	{form: deviceData}
		  , function (error, response, body) {
					data = JSON.parse(body);
		    	res.json(data);
			});

		});

		// Update device with Skynet
		app.put('/api/devices/:id', function(req, res) {
			// console.log(req);

			var deviceData = {};
			deviceData.owner = req.params.id;
			deviceData.name = req.body.name;
			deviceData.token = req.body.token;

			// flatten array
			var obj = req.body.keyvals;
			for (var i in obj) {
			  deviceData[obj[i]["key"]] = obj[i]["value"];
			}

			request.put('http://skynet.im/devices/' + req.body.uuid,
		  	{form: deviceData}
		  , function (error, response, body) {
					data = JSON.parse(body);
		    	res.json(data);
			});

		});

		// Remove device with Skynet
		app.del('/api/devices/:id/:token', function(req, res) {

			request.del('http://skynet.im/devices/' + req.params.id,
		  	{form: {"token": req.params.token}}
		  , function (error, response, body) {
					data = JSON.parse(body);
		    	res.json(data);
			});

		});


		// Register device with Skynet
		app.post('/api/message', function(req, res) {
			console.log({"devices": req.body.uuid, "message": {"text": req.body.message}});

			request.post('http://skynet.im/messages',
		  	{form: {"devices": req.body.uuid, "message": req.body.message}}
		  , function (error, response, body) {
		  		console.log(body);
					data = JSON.parse(body);
		    	res.json(data);
			});

		});

		// List of all API channels
		app.get('/api/channels', function(req, res) {
			Api.find({owner: {$exists: false}, enabled: true}, function (err, apis) {
			  	if (err) { res.send(err); } else { res.json(apis); }
			});
		});

		// List of active API channels
		app.get('/api/channels/:uuid/active', function(req, res) {
			var uuid = req.params.uuid;
			User.findOne({ $or: [
		    	{"local.skynetuuid" : uuid},
		    	{"twitter.skynetuuid" : uuid},
		    	{"facebook.skynetuuid" : uuid},
		    	{"google.skynetuuid" : uuid}
		    	]
		    	}, function(err, user) {
		    	if(err) { res.json(err); } else {
			    	var criteria = [];
			    	if(!user || !user.api) {
			    		res.json(404, {'result': 'not found'} );
			    	} else {
				    	for(var l=0; l<user.api.length; l++) {
				    		criteria.push(user.api[l].name);
				    	}
				    	Api.find({name: {$in: criteria}, enabled: true}, function(err, apis) {
				    		if(err) { res.json(err); }
				    		else { res.json(apis); }
				    	});
				    }
				}
			});
		});

		// List of active API channels
		app.get('/api/channels/:uuid/available', function(req, res) {
			var uuid = req.params.uuid;
			User.findOne({ $or: [
		    	{"local.skynetuuid" : uuid},
		    	{"twitter.skynetuuid" : uuid},
		    	{"facebook.skynetuuid" : uuid},
		    	{"google.skynetuuid" : uuid}
		    	]
		    	}, function(err, user) {
		    	if(err) { res.json(err); } else {
			    	var criteria = [];
			    	if(!user || !user.api) {
			    		res.json(404, {'result': 'not found'} );
			    	} else {
				    	for(var l=0; l<user.api.length; l++) {
				    		criteria.push(user.api[l].name);
				    	}
				    	console.log(criteria);
				    	Api.find({name: {$nin: criteria}, owner: {$exists: false}, enabled: true}, function(err, apis) {
				    		if(err) { res.json(err); }
				    		else { res.json(apis); }
				    	});
				    }
				}
			});
		});

		app.get('/api/customchannels/:uuid', function(req, res) {
			Api.find({owner: req.params.uuid, enabled: true}, function (err, apis) {
			  	if (err) { res.send(err); } else { res.json(apis); }
			});
		});

		app.put('/api/channels', function(req, res) {
			console.log('returning channel list');

			var channel = req.body;
			// console.log(channel);
			// res.json({"message":"TODO"});
			if(channel['_id']) {
				var id = channel['_id'];
				var query = {_id: id};
				delete channel['_id'];
				console.log(channel);

				Api.update(query, channel, {upsert: true}, function (err) {
				  	if (err) {
				  		console.log('error saving api');
				  		console.log(err);
				  		res.send(err);
				  	} else {
				  		channel['_id'] = id;
						res.json(channel);
					}
				});
			} else {
				var n = new Api(channel);
				n.save(function (err, n) {
				  	if (err) {
				  		console.log('error saving api');
				  		console.log(err);
				  		res.send(err);
				  	} else {
						res.json(n);
					}
				});

			}

		});

		app.get('/api/channels/:name', function(req, res) {
			Api.findOne({name: req.params.name}, function (err, api) {
			  	if (err) { res.send(err); } else { res.json(api); }
			});
		});

		app.get('/api/user_api/:id/:token', function(req, res) {

			var uuid = req.params.id,
				token = req.params.token

			User.findOne({ $or: [
		    	{"local.skynetuuid" : uuid, "local.skynettoken" : token},
		    	{"twitter.skynetuuid" : uuid, "twitter.skynettoken" : token},
		    	{"facebook.skynetuuid" : uuid, "facebook.skynettoken" : token},
		    	{"google.skynetuuid" : uuid, "google.skynettoken" : token}
		    	]
		    	}, function(err, user) {
		    	if(err) { res.json(err); } else {

			    	var criteria = [];
			    	if(!user || !user.api) {
			    		res.json(404, {'result': 'not found'} );
			    	} else {

				    	for(var l=0; l<user.api.length; l++) {
				    		criteria.push({'name': user.api[l].name});
				    	}
				    	Api.find({$or: criteria, owner: {$exists: false}, enabled: true},function(err, apis) {
				    		if(err) { res.json(err); }
				    		var results = [];
			    			for(var a=0; a<apis.length;a++) {
			    				var api = apis[a];
			    				var newApi = {};
			    				for(var l=0; l<user.api.length; l++) {
			    					if(user.api[l].name===api.name) {
			    						newApi.usersettings = user.api[l];
			    						newApi.wadl = apis[a];
								    	results.push(newApi);
			    					}
						    	}
			    			}
			    			res.json({results: results });
				    	});
				    }
					}
			});

		});

		app.put('/api/user/:id/channel/:name', function(req, res) {

			var key = req.body.key,
				token = req.body.token,
				custom_tokens = req.body.custom_tokens;

			User.findOne({ $or: [
		    	{"local.skynetuuid" : req.params.id},
		    	{"twitter.skynetuuid" : req.params.id},
		    	{"facebook.skynetuuid" : req.params.id},
		    	{"google.skynetuuid" : req.params.id}
		    	]
		    	}, function(err, user) {
			    if(!err) {
			    	user.addOrUpdateApiByName(req.params.name, 'simple', key, token, null, null, custom_tokens);
		        	user.save(function(err) {
		            	if(!err) {
		            		console.log(user);
		                	res.json(user);

		            	} else {
		                	console.log("Error: " + err);
							res.json(user);
		            	}
			        });
			    } else {
			    	res.json(err);
			    }
			});

		});

		app.delete('/api/user/:id/channel/:name', function(req, res) {

			User.findOne({ $or: [
		    	{"local.skynetuuid" : req.params.id},
		    	{"twitter.skynetuuid" : req.params.id},
		    	{"facebook.skynetuuid" : req.params.id},
		    	{"google.skynetuuid" : req.params.id}
		    	]
		    	}, function(err, user) {
			    if(!err) {

			    	var found = false,
			    		name = req.params.name;
			    	if(user.api) {
			    		for(var i = user.api.length-1; i >= 0; i--) {
			    			if(user.api[i].name === name) {
			    				user.api.splice(i,1);
					        	found = true;
					        	break;
					        }
						}

					    if(found) {
				        	user.save(function(err) {
				            	if(!err) {
				            		res.json({"message": "success"});

				            	} else {
				                	console.log("Error: " + err);
									res.json(404, {"message": "not found"});
				            	}
					        });
			        	} else {
			        		res.json(404, {"message": "not found"});
			        	}
		        	}

			    } else {
			    	res.json(err);
			    }
			});

		});

		var handleOauth1 = function(name, req, res, next) {

			var token = req.param('oauth_token'),
	        	verifier = req.param('oauth_verifier')

			User.findOne({ $or: [
		    	{"local.skynetuuid" : req.cookies.skynetuuid},
		    	{"twitter.skynetuuid" : req.cookies.skynetuuid},
		    	{"facebook.skynetuuid" : req.cookies.skynetuuid},
		    	{"google.skynetuuid" : req.cookies.skynetuuid}
		    	]
		    	}, function(err, user) {
			    if(!err) {
			    	user.addOrUpdateApiByName(name, 'oauth', null, token, null, verifier, null);
		        	user.save(function(err) {
		        		return handleApiCompleteRedirect(res, name, err);
			        });
			    }
			});

		};

		var saveOAuthInfo = function(name, uuid, key, token, secret, verifier) {

			User.findOne({ $or: [
		    	{"local.skynetuuid" : uuid},
		    	{"twitter.skynetuuid" : uuid},
		    	{"facebook.skynetuuid" : uuid},
		    	{"google.skynetuuid" : uuid}
		    	]
		    	}, function(err, user) {
			    if(!err) {
			    	user.addOrUpdateApiByName(name, 'oauth', key, token, secret, null, verifier, null);
		        	user.save(function(err) {
		        		return true;
			        });
			    } else { return false; }
			});

		};

		var getOAuthInstanceFromConfig = function(configSection) {
			var OAuth = require('oauth').OAuth;

			var oa = new OAuth(
				configSection.requestTokenURL,
				configSection.accessTokenURL,
				configSection.consumerKey,
				configSection.consumerSecret,
				configSection.oauthVersion,
				configSection.callbackURL,
				"HMAC-SHA1"
			);

			return oa;

		};

		var getCustomApiOAuthInstance = function(req, api) {
			var OAuth = require('OAuth');
			if(api.auth_strategry!="oauth" && !api.oauth) {return null;}

			if(api.oauth.version=="1.0") {
				var oa = new OAuth.OAuth(
					api.oauth.requestTokenURL,
					api.oauth.accessTokenURL,
					api.oauth.key,
					api.oauth.secret,
					api.oauth.version,
					getOAuthCallbackUrl(req, api.name),
					"HMAC-SHA1"
				);

				return oa;
			}

			// should be oauth2 at this point..
			var OAuth2 = require('simple-oauth2')({
			  clientID: api.oauth.clientId,
			  clientSecret: api.oauth.secret,
			  site: api.oauth.baseURL,
			  tokenPath: api.oauth.authTokenPath
			});

			return OAuth2;
		};

		var getOAuthCallbackUrl = function(req, apiName) {
			return req.protocol + '://' + req.headers.host + '/api/auth/'+apiName+'/callback/custom';
		};

		var handleApiCompleteRedirect = function(res, name, err) {
			if(!err) {
	        	return res.redirect('/connector/apis/'+name);
	    	} else {
	        	console.log("Error: " + err);
				return res.redirect('/connector/apis/'+name);
	    	}
		}

		var handleCustomOAuthRequest = function(req, res, name) {
			var oa = getOAuthInstanceFromConfig(config[name.toLowerCase()]);

			oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
				if (error) {
					console.log(error);
					res.send("yeah no. didn't work.")
				}
				else {

					req.session.oauth = {};
					req.session.oauth.token = oauth_token;
					// console.log('oauth.token: ' + req.session.oauth.token);
					req.session.oauth.token_secret = oauth_token_secret;
					// console.log('oauth.token_secret: ' + req.session.oauth.token_secret);

					var authURL = config.etsy.authorizationURL + '?oauth_token='
						+ oauth_token + '&oauth_consumer_key=' + config.etsy.consumerKey
						+ '&callback=' + config.etsy.callbackURL;
					res.redirect(authURL);
				}
			});
		};

		var handleCustomOAuthCallback = function(req, res, name) {
			req.session.oauth.verifier = req.query.oauth_verifier;
			var oauth = req.session.oauth;

			var oa = getOAuthInstanceFromConfig(config[name.toLowerCase()]);

			oa.getOAuthAccessToken(oauth.token, oauth.token_secret, oauth.verifier,
				function(error, oauth_access_token, oauth_access_token_secret, results){
					if (error){
						console.log(error);
						// res.send("yeah something broke.");
						res.redirect(500, '/connector/apis/' + name);
					} else {
						User.findOne({ $or: [
					    	{"local.skynetuuid" : req.cookies.skynetuuid},
					    	{"twitter.skynetuuid" : req.cookies.skynetuuid},
					    	{"facebook.skynetuuid" : req.cookies.skynetuuid},
					    	{"google.skynetuuid" : req.cookies.skynetuuid}
					    	]
					    	}, function(err, user) {
						    if(!err) {
						    	user.addOrUpdateApiByName(name, 'oauth', null,
						    		oauth_access_token, oauth_access_token_secret, null, null);
					        	user.save(function(err) {
					        		console.log('saved oauth token');
					        		return handleApiCompleteRedirect(res, name, err);
						        });
						    } else {
						    	console.log('error saving oauth token');
						    	res.redirect('/connector/apis/'+name);
						    }
						});

					}
				}
			);
		};

		// use custom OAuth handling with Etsy; re-use for others. I hope.
		app.get('/api/auth/Etsy', function(req, res){
			handleCustomOAuthRequest(req, res, 'Etsy');
		});
		app.get('/api/auth/Etsy/callback', function(req, res, next){
			if (req.session.oauth) {
				handleCustomOAuthCallback(req, res, 'Etsy');
			} else
				next(new Error("you're not supposed to be here."))
		});


		// working on custom oauth handling here.....
		app.get('/api/auth/:name/custom', function(req, res) {

			Api.findOne({name: req.params.name}, function (err, api) {

				if(api.oauth.version=="2.0") {
					var OAuth2 = getCustomApiOAuthInstance(req, api);
					var authorization_uri = OAuth2.AuthCode.authorizeURL({
					  redirect_uri: getOAuthCallbackUrl(req, api.name),
					  scope: 'notifications',
					  state: '3(#0/!~'
					});
					res.redirect(authorization_uri);

				} else {
					var oa = getCustomApiOAuthInstance(req, api);
					oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
						if (error) {
							console.log(error);
							res.send("yeah no. didn't work.")
						}
						else {
							req.session.oauth = {};
							req.session.oauth.token = oauth_token;
							req.session.oauth.token_secret = oauth_token_secret;
							console.log(req.session.oauth);

							var callbackURL = getOAuthCallbackUrl(req, api.name);
							var authURL = api.oauth.authTokenURL + '?oauth_token='
								+ oauth_token + '&oauth_consumer_key=' + api.oauth.key
								+ '&callback=' + callbackURL;
							res.redirect(authURL);
						}
					});

				}

			});

		});
		app.get('/api/auth/:name/callback/custom', function(req, res) {
			// handle oauth response....
			var name = req.params.name;

			Api.findOne({name: req.params.name}, function (err, api) {
				if (err) {
					console.log(error);
					res.redirect(500, '/apis/' + api.name);
				} else if(api.oauth.version=="2.0") {
					var OAuth2 = getCustomApiOAuthInstance(req, api);
					var code = req.query.code;

					OAuth2.AuthCode.getToken({
						code: code,
						redirect_uri: getOAuthCallbackUrl(req, api.name)
						}, function(error, result) {
							var token = result;
						    if (error) {
						    	console.log('Access Token Error', error);
						    	res.redirect('/connector/apis/'+api.name);
						    } else {
								// token = OAuth2.AccessToken.create(result).token;
							    // console.log('token='+token);
							    // res.redirect('/connector/apis/'+api.name);
							    User.findOne({ $or: [
							    	{"local.skynetuuid" : req.cookies.skynetuuid},
							    	{"twitter.skynetuuid" : req.cookies.skynetuuid},
							    	{"facebook.skynetuuid" : req.cookies.skynetuuid},
							    	{"google.skynetuuid" : req.cookies.skynetuuid}
							    	]
							    	}, function(err, user) {
								    if(!err) {
								    	user.addOrUpdateApiByName(api.name, 'oauth', null, token, null, null, null);
							        	user.save(function(err) {
							        		console.log('saved oauth token');
							        		res.redirect('/connector/apis/'+name);
								        });
								    } else {
								    	console.log('error saving oauth token');
								    	res.redirect('/connector/apis/'+name);
								    }
								});
							}
						  });

				} else {
					req.session.oauth.verifier = req.query.oauth_verifier;
					var oauth = req.session.oauth;
					var oa = getCustomApiOAuthInstance(req, api);
					oa.getOAuthAccessToken(oauth.token, oauth.token_secret, oauth.verifier,
						function(error, oauth_access_token, oauth_access_token_secret, results){
							if (error){
								console.log(error);
								res.redirect(500, '/apis/' + name);
							} else {
								User.findOne({ $or: [
							    	{"local.skynetuuid" : req.cookies.skynetuuid},
							    	{"twitter.skynetuuid" : req.cookies.skynetuuid},
							    	{"facebook.skynetuuid" : req.cookies.skynetuuid},
							    	{"google.skynetuuid" : req.cookies.skynetuuid}
							    	]
							    	}, function(err, user) {
								    if(!err) {
								    	user.addOrUpdateApiByName(name, 'oauth', null,
								    		oauth_access_token, oauth_access_token_secret, null, null);
							        	user.save(function(err) {
							        		console.log('saved oauth token');
							        		return handleApiCompleteRedirect(res, name, err);
								        });
								    } else {
								    	console.log('error saving oauth token');
								    	res.redirect('/apis/' + name);
								    }
								});

							}
						}
					);
				}
			});

		});

		app.get('/api/auth/LinkedIn',
	  	  passport.authorize('linkedin', { scope: ['r_basicprofile', 'r_emailaddress'] }));
		app.get('/api/auth/LinkedIn/callback',
			function(req, res, next) { handleOauth1('LinkedIn', req, res, next); });

		app.get('/api/auth/Readability',
	  	  passport.authorize('readability', { scope: ['r_basicprofile', 'r_emailaddress'] }));
		app.get('/api/auth/Readability/callback',
			function(req, res, next) { handleOauth1('Readability', req, res, next); });

		app.get('/api/auth/StackOverflow',
	  	  passport.authorize('stackexchange', { scope: ['r_basicprofile', 'r_emailaddress'] }));
		app.get('/api/auth/StackOverflow/callback',
			function(req, res, next) { handleOauth1('StackOverflow', req, res, next); });

		app.get('/api/auth/Bitly',
	  	  passport.authorize('bitly', { scope: ['r_basicprofile', 'r_emailaddress'] }));
		app.get('/api/auth/Bitly/callback',
			function(req, res, next) { handleOauth1('Bitly', req, res, next); });

		app.get('/api/auth/Vimeo',
	  	  passport.authorize('vimeo', { scope: ['r_basicprofile', 'r_emailaddress'] }));
		app.get('/api/auth/Vimeo/callback',
			function(req, res, next) { handleOauth1('Vimeo', req, res, next); });

		app.get('/api/auth/FourSquare',
	  	  passport.authorize('foursquare', { scope: ['r_basicprofile', 'r_emailaddress'] }));
		app.get('/api/auth/FourSquare/callback',
			function(req, res, next) { handleOauth1('FourSquare', req, res, next); });

		app.get('/api/auth/Tumblr',
	  	  passport.authorize('tumblr', { scope: ['r_basicprofile', 'r_emailaddress'] }));
		app.get('/api/auth/Tumblr/callback',
			function(req, res, next) { handleOauth1('Tumblr', req, res, next); });

		app.get('/api/auth/FitBit',
	  	  passport.authorize('fitbit', { scope: ['r_basicprofile', 'r_emailaddress'] }));
		app.get('/api/auth/FitBit/callback',
			function(req, res, next) { handleOauth1('FitBit', req, res, next); });

		app.get('/api/auth/Rdio',
	  	  passport.authorize('rdio', { scope: ['r_basicprofile', 'r_emailaddress'] }));
		app.get('/api/auth/Rdio/callback',
			function(req, res, next) { handleOauth1('Rdio', req, res, next); });

		app.get('/api/auth/LastFM', function(req, res) {
			var api_url = config.lastfm.base_url + '?api_key=' + config.lastfm.consumerKey;
			return res.redirect(api_url);
		});
		app.get('/api/auth/LastFM/callback',
			function(req, res, next) {
				// perform custom handling here....
				var token = req.param('token')

				User.findOne({ $or: [
			    	{"local.skynetuuid" : req.cookies.skynetuuid},
			    	{"twitter.skynetuuid" : req.cookies.skynetuuid},
			    	{"facebook.skynetuuid" : req.cookies.skynetuuid},
			    	{"google.skynetuuid" : req.cookies.skynetuuid}
			    	]
			    	}, function(err, user) {
				    if(!err) {
				    	user.addOrUpdateApiByName('LastFM', 'token', null, token, null, null, null);
			        	user.save(function(err) {
			        		return handleApiCompleteRedirect(res, 'LastFM', err);
				        });
				    }
				});

			});

		app.get('/api/auth/Delicious', function(req, res) {
			var api_url = config.delicious.base_url + 'auth/authorize?client_id=' + config.delicious.consumerKey;
			api_url += '&redirect_uri=' + config.delicious.callbackURL;
			return res.redirect(api_url);
		});
		app.get('/api/auth/Delicious/callback',
			function(req, res, next) {
				// perform custom handling here....
				var token = req.param('code')

				User.findOne({ $or: [
			    	{"local.skynetuuid" : req.cookies.skynetuuid},
			    	{"twitter.skynetuuid" : req.cookies.skynetuuid},
			    	{"facebook.skynetuuid" : req.cookies.skynetuuid},
			    	{"google.skynetuuid" : req.cookies.skynetuuid}
			    	]
			    	}, function(err, user) {
				    if(!err) {
				    	user.addOrUpdateApiByName('Delicious', 'token', null, token, null, null, null);
			        	user.save(function(err) {
			            	return handleApiCompleteRedirect(res, 'Delicious', err);
				        });
				    }
				});

			});


		// show the home page (will also have our login links)
		app.get('/*', function(req, res) {
			res.sendfile('./public/index.html');
		});

	}); // end skynet

};
