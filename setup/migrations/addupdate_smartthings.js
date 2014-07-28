use meshines;
function insert() {
	var api = {
		auth_strategy: "oauth",
		description: "Access your SmartThings devices",
		documentation: "http://docs.smartthings.com/",
		enabled: true,
		logo: "https://lh6.googleusercontent.com/-T_SnuUnEdWE/AAAAAAAAAAI/AAAAAAAAAAA/4kyxHEneKZ8/photo.jpg",
		name: "SmartThings",
		useCustom: true,
		application: {},
		oauth: {
			isManual: true,
			version: "2.0",
			clientId: "216bc683-5ef4-46fc-ba1c-396c70773c6a",
			secret: "b7e39f22-0e13-4fc5-b3f9-7a64f21e1a6a",
			baseURL: "https://api.surveymonkey.net",
			accessTokenURL: "https://graph.api.smartthings.com/oauth/token",
			authTokenURL: "https://graph.api.smartthings.com/oauth/authorize",
			authTokenPath: "/oauth/authorize",
			accessTokenIncludeClientInfo: true,
			grant_type: "authorization_code",
			scope: "app",
			protocol: "https",
			host: "graph.api.smartthings.com",
			passTokenInQuery: true,
			tokenQueryParam: ""
		},
		custom_tokens: [ ]
	};
	db.apis.save(api);

	var channel = db.apis.findOne({name: 'SmartThings'});
	if(!channel) return;
	var nodeType = {
        name : channel.name || 'null',
        description : channel.description || '',
        logo :  channel.logo,
        category : 'channel',
        skynet : {
            type : 'channel' ,
            subtype : channel.name
        },
        enabled : channel.enabled,
        channel: channel
    };
    printjson(channel);
    db.nodetypes.insert(nodeType);
}
function update(api) {
	api.oauth.clientId = "216bc683-5ef4-46fc-ba1c-396c70773c6a";
	api.oauth.secret = "b7e39f22-0e13-4fc5-b3f9-7a64f21e1a6a";
	api.oauth.scope = "app";
	db.apis.save(api);
}

var api = db.apis.findOne({name: 'SmartThings'});
if(api) {
	update(api);
} else {
	insert();
}