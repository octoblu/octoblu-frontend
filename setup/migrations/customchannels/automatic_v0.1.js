use meshines;
load('api_migration.js');
var apiInfo = {
	name			: 'Automatic',
	existing_id		: '53e11cd28e3257fb7d6fdad0',
	auth_strategy	: 'oauth',
	description		: '',
	documentation	: '',
	useCustom		: true,
	logo			: 'https://rdio0img-a.akamaihd.net/user/press/rdio-icon.png',
	oauth 			: {
		version			: "1.0",
		key 			: "INSERT_SECERT_HERE",
		secret 			: "INSERT_SECERT_HERE",
		accessTokenURL 	: "https://www.automatic.com/oauth/access_token",
		requestTokenURL : "https://www.automatic.com/oauth/request_token",
		authTokenURL 	: "https://www.automatic.com/oauth/authorize",
		tokenMethod 	: "oauth_signed",
		scope 			: "scope:trip:summary scope:location scope:vehicle scope:notification:hard_accel scope:notification:hard_brake scope:notification:speeding"
	}
};

var apiMigration = new ApiMigration(apiInfo);
apiMigration.run();
