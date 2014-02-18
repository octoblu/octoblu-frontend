module.exports = function(app, passport) {
	
	var User = require('./models/user');
	var Api = require('./models/api');
	var request = require('request');
	var config = require('../config/auth.js');
	var async = require('async');

	// app.get('/profile', isLoggedIn, function(req, res) {
	// 	res.render('profile', {
	// 		user : req.user
	// 	});
	// });

	app.get("/*", function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "X-Requested-With");
	  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
	  if (req.headers.host.match(/^www/) !== null) {
	    res.redirect("http://" + req.headers.host.replace(/^www\./, "") + req.url);
	  } else {
	    return next();
	  }
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.clearCookie('skynetuuid', {domain: config.domain});
		res.clearCookie('skynettoken', {domain: config.domain});
		res.redirect('/');
	});

	app.post('/login', function(req, res, next) {
		console.log('login post');
	  passport.authenticate('local-login', function(err, user, info) {
	  	console.log(user);
	    if (err) { return next(err); }
	    if (!user) { return res.redirect('/login'); }
	    req.logIn(user, function(err) {
	      if (err) { return next(err); }
	      console.log(user.local.skynetuuid);
	    res.cookie('skynetuuid', user.local.skynetuuid, {
          maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
          domain: config.domain,
          httpOnly: false
        });	
        res.cookie('skynettoken', user.local.skynettoken, {
          maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
          domain: config.domain,
          httpOnly: false
        });	

 	      console.log('redirecting');
	      return res.redirect('/dashboard');
	    });

	  })(req, res, next);
	});		


	app.post('/signup', function(req, res, next) {
	  passport.authenticate('local-signup', function(err, user, info) {
	    if (err) { return next(err); }
	    if (!user) { return res.redirect('/login'); }
	    req.logIn(user, function(err) {
	      if (err) { return next(err); }

        // Add user to Skynet
		    request.post('http://skynet.im/devices', 
		    	{form: {"type":"user", "email": user.local.email}}
			  , function (error, response, body) {
			      if(response.statusCode == 200){

			      	data = JSON.parse(body);

			        User.update({_id: user._id}, 
			        	{local: {email: user.local.email, password: user.local.password, skynetuuid: data.uuid, skynettoken: data.token}}
			        , function(err){
								if(!err) {
		                console.log("user " + data.uuid + " updated");
		                res.cookie('skynetuuid', data.uuid, {
				          maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
				          domain: config.domain,
				          httpOnly: false
				        });	
				        res.cookie('skynettoken', data.token, {
				          maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
				          domain: config.domain,
				          httpOnly: false
				        });	

					      return res.redirect('/dashboard');

		            }
		            else {
		                console.log("Error: could not update user - error " + err);
							      return res.redirect('/dashboard');

		            }
			        });

			      } else {
			        console.log('error: '+ response.statusCode);
			        console.log(error);
  			      return res.redirect('/dashboard');

			      }
			    }
			  )

	    });
	  })(req, res, next);
	});		


	app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
	app.get('/auth/facebook/callback', function(req, res, next) {

	  passport.authenticate('facebook', function(err, user, info) {
	    if (err) { return next(err); }
	    if (!user) { return res.redirect('/login'); }
	    req.logIn(user, function(err) {
	      if (err) { return next(err); }

        // Check if user exists in Skynet
				request.get('http://skynet.im/devices', 
		    	{qs: {"email": user.facebook.email}}
			  , function (error, response, body) {
			  	console.log(body);
					data = JSON.parse(body);
			    if(data.error){

		        // Add user to Skynet
				    request.post('http://skynet.im/devices', 
				    	{form: {"type":"user", "email": user.facebook.email}}
					  , function (error, response, body) {
					      if(response.statusCode == 200){

					      	data = JSON.parse(body);
									User.findOne({_id: user._id}, function(err, user) {
								    if(!err) {
							        user.facebook.skynetuuid = data.uuid.toString();
							        user.facebook.skynettoken = data.token.toString();
							        user.save(function(err) {
						            if(!err) {
						                console.log("user " + data.uuid + " updated ");
						                res.cookie('skynetuuid', data.uuid, {
								          maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
								          domain: config.domain,
								          httpOnly: false
								        });	
								        res.cookie('skynettoken', data.token, {
								          maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
								          domain: config.domain,
								          httpOnly: false
								        });	
									      return res.redirect('/dashboard');

						            }
						            else {
						                console.log("Error: " + err);
											      return res.redirect('/dashboard');

						            }
							        });
								    }
									});

					      } else {
					        console.log('error: '+ response.statusCode);
					        console.log(error);
						      return res.redirect('/dashboard');
					      }
					    }
					  )


			    } else {

			    	res.cookie('skynetuuid', data.devices[0], {
			          maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
			          domain: config.domain,
			          httpOnly: false
			        });

			    	return res.redirect('/dashboard');
			    }

				});

	    });
	  })(req, res, next);

	});


	app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));
	app.get('/auth/twitter/callback', function(req, res, next) {

	  passport.authenticate('twitter', function(err, user, info) {
	    if (err) { return next(err); }
	    if (!user) { return res.redirect('/login'); }
	    req.logIn(user, function(err) {
	      if (err) { return next(err); }
	      console.log(user);
	      console.log(info);

        // Check if user exists in Skynet
				request.get('http://skynet.im/devices', 
		    	{qs: {"email": user.twitter.username + "@twitter"}}
			  , function (error, response, body) {
			  	console.log(body);
					data = JSON.parse(body);
			    if(data.error){

		        // Add user to Skynet
				    request.post('http://skynet.im/devices', 
				    	{form: {"type":"user", "email": user.twitter.username + "@twitter"}}
					  , function (error, response, body) {
					      if(response.statusCode == 200){

					      	data = JSON.parse(body);
									User.findOne({_id: user._id}, function(err, user) {
								    if(!err) {
							        user.twitter.skynetuuid = data.uuid.toString();
							        user.twitter.skynettoken = data.token.toString();
							        user.save(function(err) {
						            if(!err) {
						                console.log("user " + data.uuid + " updated ");
										        res.cookie('skynetuuid', data.uuid, {
										          maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
										          domain: config.domain,
										          httpOnly: false
										        });	
										        res.cookie('skynettoken', data.token, {
										          maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
										          domain: config.domain,
										          httpOnly: false
										        });	
											      return res.redirect('/dashboard');

						            }
						            else {
						                console.log("Error: " + err);
											      return res.redirect('/dashboard');
						            }
							        });
								    }
									});

					      } else {
					        console.log('error: '+ response.statusCode);
					        console.log(error);
						      return res.redirect('/dashboard');
					      }
					    }
					  )


			    } else {
		        res.cookie('skynetuuid', data.devices[0], {
		          maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
		          domain: config.domain,
		          httpOnly: false
		        });		     
			    	return res.redirect('/dashboard');
			    }

				});




	    });
	  })(req, res, next);

	});


	app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
	app.get('/auth/google/callback', function(req, res, next) {

	  passport.authenticate('google', function(err, user, info) {
	    if (err) { return next(err); }
	    if (!user) { return res.redirect('/login'); }
	    req.logIn(user, function(err) {
	      if (err) { return next(err); }
	      console.log(user);
	      console.log(info);

        // Check if user exists in Skynet
				request.get('http://skynet.im/devices', 
		    	{qs: {"email": user.google.email}}
			  , function (error, response, body) {
					data = JSON.parse(body);
			    if(data.error){

		        // Add user to Skynet
				    request.post('http://skynet.im/devices', 
				    	{form: {"type":"user", "email": user.google.email}}
					  , function (error, response, body) {
					      if(response.statusCode == 200){

					      	data = JSON.parse(body);
									User.findOne({_id: user._id}, function(err, user) {
								    if(!err) {
							        user.google.skynetuuid = data.uuid.toString();
							        user.google.skynettoken = data.token.toString();
							        user.save(function(err) {
						            if(!err) {
						                console.log("user " + data.uuid + " updated ");
								        res.cookie('skynetuuid', data.uuid, {
								          maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
								          domain: config.domain,
								          httpOnly: false
								        });	
								        res.cookie('skynettoken', data.token, {
								          maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
								          domain: config.domain,
								          httpOnly: false
								        });	
									      return res.redirect('/dashboard');

						            }
						            else {
					                console.log("Error: " + err);
										      return res.redirect('/dashboard');
						            }
							        });
								    }
									});

					      } else {
					        console.log('error: '+ response.statusCode);
					        console.log(error);
						      return res.redirect('/dashboard');
					      }
					    }
					  )


			    } else {
		        res.cookie('skynetuuid', data.devices[0], {
		          maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
		          domain: config.domain,
		          httpOnly: false
		        });		     
			    	return res.redirect('/dashboard');
			    }

				});


	    });
	  })(req, res, next);

	});

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

// locally --------------------------------
	app.get('/connect/local', function(req, res) {
		res.render('connect-local.ejs', { message: req.flash('loginMessage') });
	});
	app.post('/connect/local', passport.authenticate('local-signup', {
		successRedirect : '/dashboard', // redirect to the secure profile section
		failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

// facebook -------------------------------

	// send to facebook to do the authentication
	app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

	// handle the callback after facebook has authorized the user
	app.get('/connect/facebook/callback',
		passport.authorize('facebook', {
			successRedirect : '/dashboard',
			failureRedirect : '/'
		}));

// twitter --------------------------------

	// send to twitter to do the authentication
	app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

	// handle the callback after twitter has authorized the user
	app.get('/connect/twitter/callback',
		passport.authorize('twitter', {
			successRedirect : '/dashboard',
			failureRedirect : '/'
		}));


// google ---------------------------------

	// send to google to do the authentication
	app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

	// the callback after google has authorized the user
	app.get('/connect/google/callback',
		passport.authorize('google', {
			successRedirect : '/dashboard',
			failureRedirect : '/'
		}));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

	// local -----------------------------------
	app.get('/unlink/local', function(req, res) {
		var user            = req.user;
		user.local.email    = undefined;
		user.local.password = undefined;
		user.save(function(err) {
			res.redirect('/dashboard');
		});
	});

	// facebook -------------------------------
	app.get('/unlink/facebook', function(req, res) {
		var user            = req.user;
		user.facebook.token = undefined;
		user.save(function(err) {
			res.redirect('/dashboard');
		});
	});

	// twitter --------------------------------
	app.get('/unlink/twitter', function(req, res) {
		var user           = req.user;
		user.twitter.token = undefined;
		user.save(function(err) {
			res.redirect('/dashboard');
		});
	});

	// google ---------------------------------
	app.get('/unlink/google', function(req, res) {
		var user          = req.user;
		user.google.token = undefined;
		user.save(function(err) {
			res.redirect('/dashboard');
		});
	});

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
				data = JSON.parse(body);
	    	res.json(data);
		});


	});

	// Get devices by owner
	app.get('/api/owner/gateways/:id/:token', function(req, res) {

		request.get('http://skynet.im/mydevices/' + req.params.id, 
	  	{qs: {"token": req.params.token}}
	  , function (error, response, body) {
				myDevices = JSON.parse(body);
				console.log(myDevices);
				myDevices = myDevices.devices
				gateways = []
				for (var i in myDevices) {
					if(myDevices[i].type == 'gateway'){
						gateways.push(myDevices[i]);
					}
				}
				
				request.get('http://skynet.im/devices', 
			  	{qs: {"ipAddress": req.ip, "type":"gateway"}}
			  , function (error, response, body) {
			  		console.log(body);
			  		ipDevices = JSON.parse(body);
			  		devices = ipDevices.devices

		  			if(devices) {
						async.times(devices.length, function(n, next){

								request.get('http://skynet.im/devices/' + devices[n]
							  , function (error, response, body) {
										data = JSON.parse(body);
										var dupeFound = false;
										for (var i in gateways) {
											if(gateways[i].uuid == data.uuid){
												dupeFound = true;
											}
										}										
										if(!dupeFound){
											gateways.push(data);
										}
										console.log(gateways);	
										next(error, gateways);		    	
								});						  


						}, function(err, gateways) {
							console.log(gateways[0]);
							res.json({"gateways": gateways[0]});
						});	
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
		    						newApi.name = api.name;
		    						newApi.auth_strategy = api.auth_strategy;
		    						newApi.logo_bw = api['logo-bw'];
		    						newApi.logo_color = api['logo-color'];
		    						newApi.user_settings = user.api[l];
		    						newApi.custom_tokens = api.custom_tokens;
		    						console.log(newApi);

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
		    	user.addOrUpdateApiByName(req.params.name, 'simple', key, token, null, custom_tokens);
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
		    	user.addOrUpdateApiByName(name, 'oauth', null, token, verifier, null);
	        	user.save(function(err) {
	        		return handleApiCompleteRedirect(res, user, name, err);
		        });
		    }
		});

	};

	var handleApiCompleteRedirect = function(res, user, name, err) {
		if(!err) {
        	console.log(user);
			return res.redirect('/apis/' + name);

    	} else {
        	console.log("Error: " + err);
			return res.redirect('/apis/' + name);
    	}
	}

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
			    	user.addOrUpdateApiByName('LastFM', 'token', null, token, null, null);
		        	user.save(function(err) {
		        		return handleApiCompleteRedirect(res, user, 'LastFM', err);
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
			    	user.addOrUpdateApiByName('Delicious', 'token', null, token, null, null);
		        	user.save(function(err) {
		            	return handleApiCompleteRedirect(res, user, 'Delicious', err);
			        });
			    }
			});

		});


	// show the home page (will also have our login links)
	app.get('/*', function(req, res) {
		res.sendfile('./public/index.html');
	});


};

// // route middleware to ensure user is logged in
// function isLoggedIn(req, res, next) {
// 	if (req.isAuthenticated())
// 		return next();

// 	res.redirect('/');
// }






// var Todo = require('./models/todo');

// module.exports = function(app) {

// 	// api ---------------------------------------------------------------------
// 	// get all todos
// 	app.get('/api/todos', function(req, res) {

// 		// use mongoose to get all todos in the database
// 		Todo.find(function(err, todos) {

// 			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
// 			if (err)
// 				res.send(err)

// 			res.json(todos); // return all todos in JSON format
// 		});
// 	});

// 	// create todo and send back all todos after creation
// 	app.post('/api/todos', function(req, res) {

// 		// create a todo, information comes from AJAX request from Angular
// 		Todo.create({
// 			text : req.body.text,
// 			done : false
// 		}, function(err, todo) {
// 			if (err)
// 				res.send(err);

// 			// get and return all the todos after you create another
// 			Todo.find(function(err, todos) {
// 				if (err)
// 					res.send(err)
// 				res.json(todos);
// 			});
// 		});

// 	});

// 	// delete a todo
// 	app.delete('/api/todos/:todo_id', function(req, res) {
// 		Todo.remove({
// 			_id : req.params.todo_id
// 		}, function(err, todo) {
// 			if (err)
// 				res.send(err);

// 			// get and return all the todos after you create another
// 			Todo.find(function(err, todos) {
// 				if (err)
// 					res.send(err)
// 				res.json(todos);
// 			});
// 		});
// 	});

// 	// application -------------------------------------------------------------
// 	app.get('*', function(req, res) {
// 		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
// 	});
// };