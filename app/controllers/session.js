var User = require('../models/user');

module.exports = function ( app, passport, config ) {
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
};
