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

    var ChannelAWSAuthController = require('./controllers/channel-aws-auth-controller');
    var channelAWSAuthController = new ChannelAWSAuthController();

    var ChannelBasicAuthController = require('./controllers/channel-basic-auth-controller');
    var channelBasicAuthController = new ChannelBasicAuthController();

    var NodeTypeController = require('./controllers/node-type-controller');
    var nodeTypeController = new NodeTypeController();

    var NodeController = require('./controllers/node-controller');
    var nodeController = new NodeController();

    var AppNetController = require('./controllers/app-net-controller');
    var appNetController = new AppNetController();

    var BitlyController = require('./controllers/bitly-controller');
    var bitlyController = new BitlyController();

    var BoxController = require('./controllers/box-controller');
    var boxController = new BoxController();

    var DemoFlowController = require('./controllers/demo-flow-controller');
    var demoFlowController = new DemoFlowController({meshblu: conn});

    var DropboxController = require('./controllers/dropbox-controller');
    var dropboxController = new DropboxController();

    var FacebookController = require('./controllers/facebook-controller');
    var facebookController = new FacebookController();

    var FitbitController = require('./controllers/fitbit-controller');
    var fitbitController = new FitbitController();

    var FlowController = require('./controllers/flow-controller');
    var flowController = new FlowController({meshblu: conn});

    var FlowDeployController = require('./controllers/flow-deploy');
    var flowDeployController = new FlowDeployController({meshblu: conn});

    var FlowNodeTypeController = require('./controllers/flow-node-type-controller');
    var flowNodeTypeController = new FlowNodeTypeController();

    var GithubController = require('./controllers/github-controller');
    var githubController = new GithubController();

    var GoogleController = require('./controllers/google-controller');
    var googleController = new GoogleController();

    var GoToMeetingController = require('./controllers/gotomeeting-controller');
    var goToMeetingController = new GoToMeetingController();

    var RdioController = require('./controllers/rdio-controller');
    var rdioController = new RdioController();

    var ShareFileController = require('./controllers/sharefile-controller');
    var shareFileController = new ShareFileController();

    var TwitterController = require('./controllers/twitter-controller');
    var twitterController = new TwitterController();

    var InstagramController = require('./controllers/instagram-controller');
    var instagramController = new InstagramController();

    var LinkedinController = require('./controllers/linked-in-controller');
    var linkedinController = new LinkedinController();

    var NestController = require('./controllers/nest-controller');
    var nestController = new NestController();

    var SurveyMonkeyController = require('./controllers/survey-monkey-controller');
    var surveyMonkeyController = new SurveyMonkeyController();

    var VimeoController = require('./controllers/vimeo-controller');
    var vimeoController = new VimeoController();

    var FourSquareController = require('./controllers/foursquare-controller');
    var fourSquareController = new FourSquareController();

    var SpotifyController = require('./controllers/spotify-controller');
    var spotifyController = new SpotifyController();

    var SmartsheetController = require('./controllers/smartsheet-controller');
    var smartsheetController = new SmartsheetController();

    var InvitationController = require('./controllers/invitation-controller');
    var invitationController = new InvitationController(config.betaInvites);

    var SignupController = require('./controllers/signup-controller');
    var signupController = new SignupController();

    var WebhookController = require('./controllers/webhook-controller');
    var webhookController = new WebhookController({meshblu: conn});

    var referrer = require('./controllers/middleware/referrer.js');

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
            app.post('/api/webhooks/:id', security.bypassAuth, webhookController.trigger);

            app.all('/api/*', security.isAuthenticated, security.enforceTerms);

            require('./controllers/auth')(app, passport, config);
            require('./controllers/channel')(app);
            require('./controllers/connect')(app, passport, config);
            require('./controllers/cors')(app);
            require('./controllers/device')(app, config);
            require('./controllers/elastic')(app);
            require('./controllers/message')(app, conn);
            require('./controllers/session')(app, passport, config);
            require('./controllers/unlink')(app);
            require('./controllers/user')(app);
            require('./controllers/group')(app);
            require('./controllers/permissions')(app);
            require('./controllers/designer')(app);
            require('./controllers/invitation')(app, passport, config);

            app.post('/api/auth/aws/channel/:id', channelAWSAuthController.create);
            app.post('/api/auth/basic/channel/:id', channelBasicAuthController.create);

            app.post('/api/auth/signup', signupController.verifyInvitationCode, signupController.createUser, signupController.loginUser, signupController.checkInTester, signupController.returnUser);
            app.get('/api/oauth/facebook/signup', signupController.verifyInvitationCode, signupController.storeTesterId, facebookController.authorize);
            app.get('/api/oauth/github/signup', signupController.verifyInvitationCode, signupController.storeTesterId, githubController.authorize);
            app.get('/api/oauth/google/signup', signupController.verifyInvitationCode, signupController.storeTesterId, googleController.authorize);
            app.get('/api/oauth/twitter/signup', signupController.verifyInvitationCode, signupController.storeTesterId, twitterController.authorize);

            app.post('/api/demo_flows', demoFlowController.create);

            app.post('/api/flows', flowController.create);
            app.put('/api/flows/:id', flowController.update);
            app.delete('/api/flows/:id', flowController.delete);
            app.get('/api/flows', flowController.getAllFlows);
            app.post('/api/flows/:id/instance', flowDeployController.startInstance);
            app.delete('/api/flows/:id/instance', flowDeployController.stopInstance);
            app.put('/api/flows/:id/instance', flowDeployController.restartInstance);

            app.get('/api/flow_node_types', flowNodeTypeController.getFlowNodeTypes);

            app.post('/api/invitation/request', invitationController.requestInvite);

            app.get('/api/node_types', nodeTypeController.index);
            app.get('/api/nodes', nodeController.index);

            app.get('/api/oauth/app.net',          appNetController.authorize);
            app.get('/api/oauth/app.net/callback', appNetController.callback, appNetController.redirectToDesigner);

            app.get('/api/oauth/bitly',          bitlyController.authorize);
            app.get('/api/oauth/bitly/callback', bitlyController.callback, bitlyController.redirectToDesigner);

            app.get('/api/oauth/box',          boxController.authorize);
            app.get('/api/oauth/box/callback', boxController.callback, boxController.redirectToDesigner);

            app.get('/api/oauth/dropbox',          dropboxController.authorize);
            app.get('/api/oauth/dropbox/callback', dropboxController.callback, dropboxController.redirectToDesigner);

            app.get('/api/oauth/facebook',          referrer.storeReferrer, facebookController.authorize);
            app.get('/api/oauth/facebook/callback', facebookController.callback, signupController.checkInTester, referrer.restoreReferrer, referrer.redirectToReferrer, facebookController.redirectToDesigner);

            app.get('/api/oauth/fitbit',          fitbitController.authorize);
            app.get('/api/oauth/fitbit/callback', fitbitController.callback, fitbitController.redirectToDesigner);

            app.get('/api/oauth/github',          referrer.storeReferrer, githubController.authorize);
            app.get('/api/oauth/github/callback', githubController.callback, signupController.checkInTester, referrer.restoreReferrer, referrer.redirectToReferrer, githubController.redirectToDesigner);

            app.get('/api/oauth/google',          referrer.storeReferrer, googleController.authorize);
            app.get('/api/oauth/google/callback', googleController.callback, signupController.checkInTester, referrer.restoreReferrer, referrer.redirectToReferrer, googleController.redirectToDesigner);

            app.get('/api/oauth/goToMeeting',          goToMeetingController.authorize);
            app.get('/api/oauth/goToMeeting/callback', goToMeetingController.callback, goToMeetingController.redirectToDesigner);

            app.get('/api/oauth/google-drive',          referrer.storeReferrer, googleController.authorize);
            app.get('/api/oauth/google-drive/callback', googleController.callback, signupController.checkInTester, referrer.restoreReferrer, referrer.redirectToReferrer, googleController.redirectToDesigner);

            app.get('/api/oauth/rdio',          rdioController.authorize);
            app.get('/api/oauth/rdio/callback', rdioController.callback, rdioController.redirectToDesigner);

            app.get('/api/oauth/sharefile',          shareFileController.authorize);
            app.get('/api/oauth/sharefile/callback', shareFileController.callback, shareFileController.redirectToDesigner);

            app.get('/api/oauth/instagram',          instagramController.authorize);
            app.get('/api/oauth/instagram/callback', instagramController.callback, instagramController.redirectToDesigner);

            app.get('/api/oauth/nest',          nestController.authorize);
            app.get('/api/oauth/nest/callback', nestController.callback, nestController.redirectToDesigner);

            app.get('/api/oauth/survey-monkey',          surveyMonkeyController.authorize);
            app.get('/api/oauth/survey-monkey/callback', surveyMonkeyController.callback, surveyMonkeyController.redirectToDesigner);

            app.get('/api/oauth/vimeo',          vimeoController.authorize);
            app.get('/api/oauth/vimeo/callback', vimeoController.callback, vimeoController.redirectToDesigner);

            app.get('/api/oauth/linked-in',          linkedinController.authorize);
            app.get('/api/oauth/linked-in/callback', linkedinController.callback, linkedinController.redirectToDesigner);

            app.get('/api/oauth/four-square',          fourSquareController.authorize);
            app.get('/api/oauth/four-square/callback', fourSquareController.callback, fourSquareController.redirectToDesigner);

            app.get('/api/oauth/smartsheet',          smartsheetController.authorize);
            app.get('/api/oauth/smartsheet/callback', smartsheetController.callback, smartsheetController.redirectToDesigner);

            app.get('/api/oauth/spotify',          spotifyController.authorize);
            app.get('/api/oauth/spotify/callback', spotifyController.callback, spotifyController.redirectToDesigner);

            app.get('/api/oauth/twitter',          referrer.storeReferrer, twitterController.authorize);
            app.get('/api/oauth/twitter/callback', twitterController.callback, signupController.checkInTester, referrer.restoreReferrer, referrer.redirectToReferrer, twitterController.redirectToDesigner);

            app.all(['/api/*', '/angular/*', '/assets/*', '/lib/*', '/pages/*'], function(req, res) {
                res.send(404, req.url);
            });

            app.get('/*', function(req, res) {
                res.sendfile('./public/index.html');
            });
        } catch(err) {
            console.log(err.stack);
            throw err;
        }
    }); // end skynet (and everything else)
};
