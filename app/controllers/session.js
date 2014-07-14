'use strict';

var mongoose      = require('mongoose'),
    nodemailer    = require('nodemailer'),
    request       = require('request'),
    generateUrlSafeToken = require('../models/mixins/resource').generateUrlSafeToken,
    User          = mongoose.model('User');

module.exports = function ( app, passport, config ) {

  app.post('/api/reset', function(req, res, next) {
    var user;
    User.findByEmail(req.body.email)
      .then(function(dbUser){
        user = dbUser;

        if (!user) {
          throw {code: 404, errors: {email: ['No account with that email address exists.']}};
        }

        return generateUrlSafeToken();
      })
      .then(function(token){
        user.resetPasswordToken   = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        return user.saveWithPromise();
      })
      .then(function(){
        var smtpTransport, mailOptions;

        smtpTransport = nodemailer.createTransport("SMTP", {
          service: "Gmail",
          auth: {
            user: config.email.SMTP.Gmail.user,
            pass: config.email.SMTP.Gmail.password
          }
        });

        mailOptions = {
          to: user.email,
          subject: 'Octoblu Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + user.resetPasswordToken + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };

        smtpTransport.sendMail(mailOptions, function(error) {
           if (error) { throw {code: 500, errors: {all: [error]}} }
           res.send(201);
        });

      }).catch(function(options){
        if(options.code) {
          return res.send(options.code, {errors: options.errors});
        }
        return res.send(500, {errors: options.errors, arguments: arguments});
      });
  });

  app.put('/api/reset/:token', function(req, res, next){
    User.findByResetToken(req.params.token).then(function(user){
      if(!user){
        return res.send(404, {error: 'Password reset token is invalid or has expired.', arguments: arguments});
      }

      user.local.password       = user.generateHash(req.body.password);
      user.resetPasswordToken   = null;
      user.resetPasswordExpires = null;

      user.save(function(error, returnedUser) {
        if(error) {
          return res.send(404, {error: error});
        }

        return res.send(204);
      });
    },function(error){
      res.send(404, {error: error});
    });
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
                  if(req.session.js){
                      return res.send('<script>window.location.href="' + req.session.redirect + '?uuid=' + user.local.skynetuuid + '&token=' + user.local.skynettoken + '"</script>');
                  } else {
                    return res.redirect(req.session.redirect + '?uuid=' + user.local.skynetuuid + '&token=' + user.local.skynettoken);
                  }
                } else {
                  return res.redirect('/dashboard');
                }


		            }
		            else {
		                console.log("Error: could not update user - error " + err);
							      // return res.redirect('/dashboard');
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

		            }
			        });

			      } else {
			        console.log('error: '+ response.statusCode);
			        console.log(error);
  			      // return res.redirect('/dashboard');
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

			      }
			    }
			  )

	    });
	  })(req, res, next);
	});
};
