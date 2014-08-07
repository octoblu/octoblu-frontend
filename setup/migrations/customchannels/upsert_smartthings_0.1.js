use meshines;
function add() {
	var api = {
			auth_strategy: "oauth",
			description: "Access your SmartThings devices",
			documentation: "http://docs.smartthings.com/",
			enabled: true,
			logo: "https://lh6.googleusercontent.com/-T_SnuUnEdWE/AAAAAAAAAAI/AAAAAAAAAAA/4kyxHEneKZ8/photo.jpg",
			name: "SmartThings",
			useCustom: true,
			application: {
				base: 'https://graph.api.smartthings.com/api',
				resources: [
					{
				        "httpMethod": "GET",
				        "authentication": {"required": "true"},
				        "curl": "curl -XGET https://graph.api.smartthings.com/api/smartapps/endpoints",
				        "params": [],
				        "path": "/smartapps/endpoints"
				      },
				]
			},
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

	// NOW Add NodeType for SmartThings:
	var nodeType = {
        name : api.name || 'null',
        description : api.description || '',
        logo :  api.logo,
        category : 'channel',
        skynet : {
            type : 'channel' ,
            subtype : api.name
        },
        enabled : api.enabled,
        channel: channel
    };
    printjson(channel);
    db.nodetypes.insert(nodeType);
}
function update(api) {
	if(!api.application.resources) api.application.resources = [];
	api.application.base = 'https://graph.api.smartthings.com/api';
	if(api.application.resources  || api.application.resources.length<0) {
		var discoveryMethod = api.application.resources.filter(function (resource) { 
	        return resource.path === "/smartapps/endpoints";
	    });

	    if(!discoveryMethod || discoveryMethod.length==0) {
	    	api.application.resources.push({
					        "httpMethod": "GET",
					        "authentication": {"required": "true"},
					        "curl": "curl -XGET https://graph.api.smartthings.com/api/smartapps/endpoints",
					        "params": [],
					        "path": "/smartapps/endpoints"
					      })    	;
	    }
	}

	db.apis.save(api);

	//update nodeType
	var nodeType = db.nodetypes.findOne({"channel._id": api._id});
	if(nodeType) nodeType.channel = api;
	db.nodetypes.save(nodeType);
}

var api = db.apis.findOne({name: 'SmartThings'});
if(api) {
	update(api);
} else add();
