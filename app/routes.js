module.exports = function(app, passport) {
<<<<<<< HEAD
  // Import models
	var User    = require('./models/user');
	var Api     = require('./models/api');
  var Device  = require('./models/device');

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
        /**
         *
         * P - Find all the Gateways that you own
         * P - Find all the unclaimed Gateways that are on your network
         * For Each(Gateway){
         *     find the plugins for the gateway
         *     find the subdevices for the gateway
         * }
         *
         * combine the list of gateways [owned and claimed] and return them
         */

    // // Get elastic query
    // app.get('/api/elastic/query/:query', function(req, res) {
    //
    //   elastic.search({
    //     index: 'log',
    //     q: req.params.query
    //   }, function (error, response) {
    //     console.log('error', error);
    //     console.log('response', response);
    //     try{
    //       data = JSON.parse(response);
    //     } catch(e){
    //       data = {};
    //     }
    //     res.json(data);
    //   });
    //
    // });

		// Get devices by owner
		app.get('/api/owner/gateways/:id/:token', function(req, res) {
			console.log('Return Devices? ', req.query.devices);
      console.log('ip address ', req.ip) ;
			request.get('http://skynet.im/mydevices/' + req.params.id,
		  	{qs: {"token": req.params.token}}
		  , function (error, response, body) {
					myDevices = JSON.parse(body);
					myDevices = myDevices.devices;
					console.log('myDevices', myDevices);
					var gateways = [] ;
					for (var i in myDevices) {
						if(req.query.devices == 'true'){
							gateways.push(myDevices[i]);
						} else {
							if(myDevices[i].type == 'gateway'){
								gateways.push(myDevices[i]);
							}

						}
					}
					console.log('My Devices ', gateways);
					request.get('http://skynet.im/devices',
				  	{qs: {"ipAddress": req.ip, "type":"gateway", "owner": null }}
				  , function (error, response, body) {
              console.log(body);
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



                    // // Lookup plugins on each gateway
                    // async.times(gatewaysLength, function(n, next){
                    //   conn.gatewayConfig({
                    //     "uuid": gateways[n].uuid,
                    //     "token": gateways[n].token,
                    //     "method": "getPlugins"
                    //   }, function (plugins) {
                    //     console.log('plugins:', plugins.result);
                    //
                    //     // Get default options for each plugin
                    //     for (var p in plugins) {
                    //       conn.gatewayConfig({
                    //         "uuid": gateways[n].uuid,
                    //         "token": gateways[n].token,
                    //         "method": "getDefaultOptions",
                    //         "name": p.name
                    //       }, function (pluginOptions) {
                    //         console.log('plugin options:', pluginOptions);
                    //         gateways[n].plugins.options = pluginOptions;
                    //         next(error, gateways[n]);
                    //       });
                    //     }
                    //
                    //     gateways[n].plugins = plugins.result;
                    //     next(error, gateways[n]);
                    //   });
                    //
                    // }, function(err, gateways) {


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

    // List of all Smart Devices
    app.get('/api/smartdevices', function(req, res) {
      Device.find({enabled: true}, function (err, apis) {
          if (err) { res.send(err); } else { res.json(apis); }
      });
=======
    // Setup config
    var env = app.settings.env;
    var config = require('../config/auth')(env);
    var skynet = require('skynet');

    console.log('Connecting to SkyNet...');

    // Generic UUID / Token for SkyNet API calls
    var conn = skynet.createConnection({
        "uuid": "9b47c2f1-9d9b-11e3-a443-ab1cdce04787",
        "token": "pxdq6kdnf74iy66rhuvdw9h5d2f0f6r",
        "protocol": "websocket"
>>>>>>> remotes/origin/develop
    });

    conn.on('notReady', function(data){
        console.log('SkyNet authentication: failed');
    });

    // Attach additional routes
    conn.on('ready', function(data){
        console.log('SkyNet authentication: success');

        // Initialize Controllers
        require('./controllers/auth')(app, passport, config);
        require('./controllers/channel')(app);
        require('./controllers/connect')(app, passport, config);
        require('./controllers/cors')(app);
        require('./controllers/device')(app);
        //require('./controllers/elastic')(app);
        require('./controllers/message')(app, conn);
        require('./controllers/owner')(app, conn);
        require('./controllers/redport')(app);
        require('./controllers/session')(app, passport, config);
        require('./controllers/unlink')(app);
        require('./controllers/user')(app);

        // show the home page (will also have our login links)
        app.get('/*', function(req, res) {
            res.sendfile('./public/index.html');
        });
    }); // end skynet
};
