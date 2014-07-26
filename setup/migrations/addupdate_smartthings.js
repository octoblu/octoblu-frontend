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
			clientId: "1a9beb2e-5865-4f86-9f91-cd293d9f4747",
			secret: "040313d4-db5e-4489-9675-fa60d4be9004",
			baseURL: "https://api.surveymonkey.net",
			accessTokenURL: "https://graph.api.smartthings.com/oauth/token",
			authTokenURL: "https://graph.api.smartthings.com/oauth/authorize",
			authTokenPath: "/oauth/authorize",
			accessTokenIncludeClientInfo: true,
			grant_type: "authorization_code",
			scope: "",
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
	// db.apis.save(api);
}

var api = db.apis.findOne({name: 'SmartThings'});
if(api) {
	update(api);
} else {
	insert();
}