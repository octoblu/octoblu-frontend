'use strict';

var mongoose = require('mongoose'),
	request = require('request'),
    User = mongoose.model('User');

module.exports = function ( app, passport, config ) {

	app.get('/logout', function(req, res) {
		req.logout();
		res.clearCookie('skynetuuid', {domain: config.domain});
		res.clearCookie('skynettoken', {domain: config.domain});
        delete req.session.user;
		// Check for deeplink redirect > http://localhost:8080/logout?referrer=http:%2F%2Flocalhost%2Fauth.js
		if(req.query.referrer && req.query.referrer.length){
      if(req.query.js){
          return res.send('<script>window.location.href="' + req.query.referrer + '"</script>');
      } else {
          return res.redirect(req.query.referrer);
      }      		
		} else {
			res.redirect('/');
		}
	});

	app.post('/login', function(req, res, next) {
		console.log('login post');
        delete req.session.user;
	  passport.authenticate('local-login', function(err, user, info) {
	  	console.log(user);
	    if (err) { return next(err); }
	    if (!user) { return res.redirect('/login'); }
	    req.logIn(user, function(err) {
	      if (err) { return next(err); }
	      console.log(user.local.skynetuuid);
        req.session.user = user;
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

        // Check for deep link redirect based on referrer in querystring
        if(req.session.redirect){          
          if(req.session.js){
              return res.send('<script>window.location.href="' + req.session.redirect + '?uuid=' + user.local.skynetuuid + '&token=' + user.local.skynettoken + '"</script>');
          } else {
              return res.redirect(req.session.redirect + '?uuid=' + user.local.skynetuuid + '&token=' + user.local.skynettoken);
          }         
        } else {
          return res.redirect('/dashboard');
        }

 	     //  console.log('redirecting');
	      // return res.redirect('/dashboard');
	    });

	  })(req, res, next);
	});

	app.post('/signup', function(req, res, next) {
    delete req.session.user;
    res.clearCookie('skynetuuid', {domain: config.domain});
    res.clearCookie('skynettoken', {domain: config.domain});
    
	  passport.authenticate('local-signup', function(err, user, info) {
      console.log('err', err);
      console.log('user', user);
      console.log('info', info);
	    if (err) { return next(err); }
	    if (!user) { return res.redirect('/login'); }
	    req.logIn(user, function(err) {
	      if (err) { return next(err); }

        // Add user to Skynet'
		    request.post( req.protocol + '://' + app.locals.skynetUrl + '/devices',
		    	{form: {"type":"user", "email": user.local.email}}
			  , function (error, response, body) {
			  		// console.log(response.statusCode, body);
			      if(response.statusCode == 200){

			      	var data = JSON.parse(body);

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
                req.session.user = user;
					      // return res.redirect('/dashboard');
                // Check for deep link redirect based on referrer in querystring
                if(req.session.redirect){
                  return res.redirect(req.session.redirect + '?uuid=' + user.local.skynetuuid + '&token=' + user.local.skynettoken);
                } else {
                  return res.redirect('/dashboard');
                }


		            }
		            else {
		                console.log("Error: could not update user - error " + err);
							      // return res.redirect('/dashboard');
                    // Check for deep link redirect based on referrer in querystring
                    if(req.session.redirect){
                      return res.redirect(req.session.redirect + '?uuid=' + user.local.skynetuuid + '&token=' + user.local.skynettoken);
                    } else {
                      return res.redirect('/dashboard');
                    }

		            }
			        });

			      } else {
			        console.log('error: '+ response.statusCode);
			        console.log(error);
  			      // return res.redirect('/dashboard');
              // Check for deep link redirect based on referrer in querystring
              if(req.session.redirect){
                return res.redirect(req.session.redirect + '?uuid=' + user.local.skynetuuid + '&token=' + user.local.skynettoken);
              } else {
                return res.redirect('/dashboard');
              }

			      }
			    }
			  )

	    });
	  })(req, res, next);
	});
};
