var User    = require('../models/user'),
    request = require('request');

module.exports = function ( app, passport, config ) {
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

			    	// res.cookie('skynetuuid', data.devices[0], {
			     //      maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
			     //      domain: config.domain,
			     //      httpOnly: false
			     //    });

		        res.cookie('skynetuuid', user.facebook.skynetuuid, {
		          maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
		          domain: config.domain,
		          httpOnly: false
		        });		     
		        res.cookie('skynettoken', user.facebook.skynettoken, {
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
		        // res.cookie('skynetuuid', data.devices[0], {
		        //   maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
		        //   domain: config.domain,
		        //   httpOnly: false
		        // });		     
		        res.cookie('skynetuuid', user.twitter.skynetuuid, {
		          maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
		          domain: config.domain,
		          httpOnly: false
		        });		     
		        res.cookie('skynettoken', user.twitter.skynettoken, {
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
		        res.cookie('skynetuuid', user.google.skynetuuid, {
		          maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
		          domain: config.domain,
		          httpOnly: false
		        });		     
		        res.cookie('skynettoken', user.google.skynettoken, {
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
};
