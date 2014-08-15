module.exports = function(app, passport) {
    // Setup config
    var env = app.settings.env;
    var config = require('../config/auth')(env);
    var skynet = require('skynet');
    var security = require('./controllers/middleware/security');

    //set the skynetUrl
    app.locals.skynetUrl = config.skynet.host + ':' + config.skynet.port;

    console.log('Connecting to SkyNet...');

    // Generic UUID / Token for SkyNet API calls
    var conn = skynet.createConnection({
        "uuid"     : "9b47c2f1-9d9b-11e3-a443-ab1cdce04787",
        "token"    : "pxdq6kdnf74iy66rhuvdw9h5d2f0f6r",
        "server"   : config.skynet.host,
        "port"     : config.skynet.port,
        "protocol" : "websocket"
    });

    var FlowController = require('./controllers/flow-controller');
    var flowController = new FlowController();

    var FlowDeployController = require('./controllers/flow-deploy');
    var flowDeployController = new FlowDeployController({meshblu: conn});

    var FlowNodeTypeController = require('./controllers/flow-node-type-controller');
    var flowNodeTypeController = new FlowNodeTypeController();

    conn.on('notReady', function(data){
        console.log('SkyNet authentication: failed');
    });

    // Attach additional routes
    conn.on('ready', function(data){

        console.log('SkyNet authentication: success');

        app.post('*', function(request, response, next){
            console.log(request.body);
            next();
        });
        app.post('/api/auth', security.bypassAuth);
        app.post('/api/auth/signup', security.bypassAuth);
        app.all('/api/auth', security.bypassTerms);
        app.all('/api/auth/*', security.bypassTerms);
        app.all('/api/*', security.isAuthenticated, security.enforceTerms);

        // Initialize Controllers
        require('./controllers/auth')(app, passport, config);
        require('./controllers/channel')(app);
        require('./controllers/connect')(app, passport, config);
        require('./controllers/cors')(app);
        require('./controllers/device')(app, config);
        require('./controllers/elastic')(app);
        require('./controllers/message')(app, conn);
        require('./controllers/redport')(app, config);
        require('./controllers/session')(app, passport, config);
        require('./controllers/unlink')(app);
        require('./controllers/user')(app);
        require('./controllers/group')(app);
        require('./controllers/permissions')(app);
        require('./controllers/node')(app);
        require('./controllers/designer')(app);
        require('./controllers/invitation')(app, passport, config);

        app.put('/api/flows/:id', flowController.updateOrCreate);
        app.delete('/api/flows/:id', flowController.delete);
        app.get('/api/flows', flowController.getAllFlows);
        app.post('/api/flow_deploys', flowDeployController.create);

        app.get('/api/flow_node_types', flowNodeTypeController.getFlowNodeTypes);

        // show the home page (will also have our login links)
        app.get('/*', function(req, res) {
            res.sendfile('./public/index.html');
        });
    }); // end skynet
};
