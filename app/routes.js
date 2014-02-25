module.exports = function(app, passport) {
  // Import models
	var User    = require('./models/user');
	var Api     = require('./models/api');

  // Setup config
	var request = require('request');
	var config = require('../config/auth.js');
	var async = require('async');
	var skynet = require('skynet');

  // Connect to SkyNet
	console.log('connecting to skynet');
	var conn = skynet.createConnection({
	  "uuid": "9b47c2f1-9d9b-11e3-a443-ab1cdce04787",
	  "token": "pxdq6kdnf74iy66rhuvdw9h5d2f0f6r",
	  "protocol": "websocket"
	});

	conn.on('notReady', function(data){
		console.log('skynet authentication failed');
	});

  // Attach additional routes
	conn.on('ready', function(data){
    
	  // Initialize Controllers
    require('./controllers/cors')(app);
    require('./controllers/session')(app, passport, config);
    require('./controllers/oauth')(app, passport, config);
    require('./controllers/connect')(app, passport, config);
    require('./controllers/unlink')(app);
    require('./controllers/post')(app);

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
		request.get('http://skynet.im/mydevices/' + req.params.id, 
	  	{qs: {"token": req.params.token}}
	  , function (error, response, body) {
				myDevices = JSON.parse(body);
				myDevices = myDevices.devices
				var gateways = []
				for (var i in myDevices) {
					if(myDevices[i].type == 'gateway'){
						gateways.push(myDevices[i]);
					}
				}
				
				request.get('http://skynet.im/devices', 
			  	{qs: {"ipAddress": req.ip, "type":"gateway"}}
			  , function (error, response, body) {
			  		ipDevices = JSON.parse(body);
			  		devices = ipDevices.devices

		  			if(devices) {
							async.times(devices.length, function(n, next){

								request.get('http://skynet.im/devices/' + devices[n]
							  , function (error, response, body) {
										data = JSON.parse(body);
										console.log(data);
										var dupeFound = false;
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


							}, function(err, gateways) {

								gateways = gateways[0]
									// console.log('gateways plugins check');

								// Lookup plugins on each gateway
								async.times(gateways.length, function(n, next){									
						      conn.gatewayConfig({
						        "uuid": gateways[n].uuid,
						        "token": gateways[n].token,
						        "method": "getPlugins"
						      }, function (plugins) {
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

	// List of available API channels
	app.get('/api/channels', function(req, res) {
		console.log('returning channel list');

		Api.find(function (err, apis) {
		  	if (err) {
		  		res.send(err);
		  	} else {
				res.json(apis);
			}
		});

	});	

	app.get('/api/channels/:name', function(req, res) {
		Api.findOne({name: req.params.name}, function (err, api) {
		  	if (err) {
		  		res.send(err);
		  	} else {
				res.json(api);
			}
		});

	});

	app.get('/api/user_api/:id/:token', function(req, res) {

		var uuid = req.params.id, 
			token = req.params.token

		// console.log(uuid);
		// res.json({});

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
			    	Api.find({$or: criteria},function(err, apis) {
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

		// console.log(custom_tokens);
		// res.json({});

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

	var handleApiCompleteRedirect = function(res, name, err) {
		if(!err) {
        	return res.redirect('/apis/' + name);
    	} else {
        	console.log("Error: " + err);
			return res.redirect('/apis/' + name);
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
				console.log('oauth.token: ' + req.session.oauth.token);
				req.session.oauth.token_secret = oauth_token_secret;
				console.log('oauth.token_secret: ' + req.session.oauth.token_secret);
				
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
