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

function add() {
	api = {};
	api.name = "Rdio";
	api.application = {};
	api.application.resources = [];
	api.auth = "oauth";
	// api.isManual = true;
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
	return api;
}
// find Moheeb's version
var api = db.apis.findOne({_id: ObjectId('53d15c363e304fe01a0851ee')});

//find old version
var old = db.apis.findOne({name: 'Rdio'});
if(old) {
	printjson(old.owner);
}

var old = db.apis.findOne({name: 'Rdio', 'owner': {$exists: false} });
if(old) {
	printjson('has old rdio api doc');
}
if(old && old._id != ObjectId('53d15c363e304fe01a0851ee')) {
	db.apis.remove(old);
}

if(api) {
	printjson('updating...');
	update(api);	
} else {
	api = add();
}

var nodeType = db.nodetypes.findOne({"channel._id": ObjectId('53d15c363e304fe01a0851ee')});
if(nodeType) {
	printjson('adding nodeType...');
	nodeType.channel = api;
	db.nodetypes.save(nodeType);
} else {
	printjson('inserting nodeType...');
	nodeType = {
	    name : api.name || 'null',
	    description : api.description || '',
	    logo :  api.logo,
	    category : 'channel',
	    skynet : {
	        type : 'channel' ,
	        subtype : api.name
	    },
	    enabled : api.enabled,
	    channel: api
	};
	// printjson(api);
	db.nodetypes.insert(nodeType);
}