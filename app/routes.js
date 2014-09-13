module.exports = function(app, passport) {
    // setting env to app.settings.env
    var env = app.settings.env;
    var config = require('../config/auth')(env);
    var skynet = require('skynet');
    var security = require('./controllers/middleware/security');

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

    var NodeTypeController = require('./controllers/node-type-controller');
    var nodeTypeController = new NodeTypeController();

    var NodeController = require('./controllers/node-controller');
    var nodeController = new NodeController();

    var DropboxController = require('./controllers/dropbox-controller');
    var dropboxController = new DropboxController();

    var FlowController = require('./controllers/flow-controller');
    var flowController = new FlowController();

    var FlowDeployController = require('./controllers/flow-deploy');
    var flowDeployController = new FlowDeployController({meshblu: conn});

    var FlowNodeTypeController = require('./controllers/flow-node-type-controller');
    var flowNodeTypeController = new FlowNodeTypeController();

    var GithubController = require('./controllers/github-controller');
    var githubController = new GithubController();

    var InvitationController = require('./controllers/invitation-controller');
    var invitationController = new InvitationController(config.betaInvites);

    var SignupController = require('./controllers/signup-controller');
    var signupController = new SignupController();

    conn.on('notReady', function(data){
        console.log('SkyNet authentication: failed');
    });

    // Attach additional routes
    conn.on('ready', function(data){
        console.log('SkyNet authentication: success');
        try {
            app.post('/api/auth', security.bypassAuth);
            app.all('/api/auth', security.bypassTerms);
            app.all('/api/auth/*', security.bypassAuth, security.bypassTerms);
            app.all('/api/oauth/*', security.bypassAuth, security.bypassTerms);
            app.post('/api/invitation/request', security.bypassAuth, security.bypassTerms);

            app.all('/api/*', security.isAuthenticated, security.enforceTerms);


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
            require('./controllers/designer')(app);
            require('./controllers/invitation')(app, passport, config);

            app.post('/api/auth/signup', signupController.signup);

            app.put('/api/flows/:id', flowController.updateOrCreate);
            app.delete('/api/flows/:id', flowController.delete);
            app.get('/api/flows', flowController.getAllFlows);
            app.post('/api/flows/:id/instance', flowDeployController.startInstance);
            app.delete('/api/flows/:id/instance', flowDeployController.stopInstance);
            app.put('/api/flows/:id/instance', flowDeployController.restartInstance);

            app.get('/api/flow_node_types', flowNodeTypeController.getFlowNodeTypes);

            app.post('/api/invitation/request', invitationController.requestInvite);

            app.get('/api/node_types', nodeTypeController.index);
            app.get('/api/nodes', nodeController.index);

            app.get('/api/oauth/dropbox',          dropboxController.authorize);
            app.get('/api/oauth/dropbox/callback', dropboxController.callback, dropboxController.redirectToDesigner);

            app.get('/api/oauth/github',          githubController.authorize);
            app.get('/api/oauth/github/callback', githubController.callback, githubController.redirectToDesigner);

            app.get('/*', function(req, res) {
                res.sendfile('./public/index.html');
            });
        } catch(err) {
            console.log(err.stack);
            throw err;
        }
    }); // end skynet (and everything else)
};
