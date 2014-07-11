'use strict';

var async      = require('async'),
    crypto     = require('crypto'),
    mongoose   = require('mongoose'),
    nodemailer = require('nodemailer'),
    request    = require('request'),
    User       = mongoose.model('User');

module.exports = function ( app, passport, config ) {

  app.post('/forgot', function(req, res, next) {
    async.waterfall([
      generateToken,
      function(token, done) {

        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            return res.send({errors: {email: ['No account with that email address exists.']}}, 404);
          }

          user.resetPasswordToken   = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
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
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };

        smtpTransport.sendMail(mailOptions, function(err) {
          done(err);
        });
      }
    ], function(error){
      if(error) { return res.send(error, 500); }
      return res.send(arguments);
      res.redirect('/login');
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

var generateToken = function(done){
  crypto.randomBytes(20, function(err, buf) {
    var token = buf.toString('hex');
    done(err, token);
  });
}
