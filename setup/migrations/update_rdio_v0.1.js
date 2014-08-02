use meshines;
function update(api) {
	delete api.owner;	
	// api.useCustom = true;
	api.oauth = {
		"version" 			: "1.0",
		"key" 				: "8xrf6qedwvp2m5zmwrrhbb2j",
		"secret" 			: "E5EbEc5vdf",
		"accessTokenURL" 	: "http://api.rdio.com/oauth/access_token",
		"requestTokenURL" 	: "http://api.rdio.com/oauth/request_token",
		"authTokenURL" 		: "https://www.rdio.com/oauth/authorize",
		"tokenMethod" 		: "oauth_signed",
		"scope" 			: "user"
	};
	
	db.apis.save(api);
}

// find Moheeb's version
var api = db.apis.findOne({name: 'Rdio', owner: { $exists: true});

//find old version
var old = db.apis.findOne({name: 'Rdio', owner: { $exists: false});
if(old && api && api.application && api.application.resources && api.aplication.resources.length>1) {
	db.apis.remove(old);
}

if(api) {
	update(api);
}
