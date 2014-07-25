use meshines;
function update(api) {
	delete api.owner;
	api.oauth = {
			isManual: true,
			version: "2.0",
			clientId: "vyscb5uzhypva3t8x2fd93hu",
			secret: "MfS2A9Z9uBZVHrmMKY9R4ZQFUVGESAum",
			baseURL: "https://api.surveymonkey.net",
			accessTokenURL: "https://api.surveymonkey.net/oauth/token",
			authTokenURL: "https://api.surveymonkey.com/oauth/authorize",
			tokenMethod: "apikey_app_query",
			authTokenPath: "/oauth/authorize",
			accessTokenIncludeClientInfo: true,
			grant_type: "authorization_code",
			scope: "",
			protocol: "https",
			host: "api.surveymonkey.net",
			passTokenInQuery: true,
			tokenQueryParam: "oauth2_access_token",
			auth_use_client_id_value: "rebootd",
			auth_use_api_key: true
		};
	
	db.apis.save(api);
}

var api = db.apis.findOne({name: 'Survey Monkey'});
if(api) {
	update(api);
}
