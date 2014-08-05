use meshines;
load('api_migration.js');
var apiInfo = {
	name			: 'Rdio',
	existing_id		: '53d15c363e304fe01a0851ee',
	auth_type		: 'oauth',
	oauth 			: {
		version			: "1.0",
		key 			: "8xrf6qedwvp2m5zmwrrhbb2j",
		secret 			: "E5EbEc5vdf",
		accessTokenURL 	: "http://api.rdio.com/oauth/access_token",
		requestTokenURL : "http://api.rdio.com/oauth/request_token",
		authTokenURL 	: "https://www.rdio.com/oauth/authorize",
		tokenMethod 	: "oauth_signed",
		scope 			: "user"
	}
};

var apiMigration = new ApiMigration(apiInfo);
apiMigration.run();
