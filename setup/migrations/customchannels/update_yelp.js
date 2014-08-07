use meshines;
load('api_migration.js');
var apiInfo = {
	name			: 'Yelp',
	existing_id		: '53dab882993d558f4a859a6b',
	auth_strategy	: 'none',
	description		: '',
	documentation	: '',
	useCustom		: true,
	logo			: 'http://www.greathillsent.com/images/yelp.png',
	oauth 			: {
		version			: "1.0",
		key 			: "",
		secret 			: ""
	}
};

var apiMigration = new ApiMigration(apiInfo);
apiMigration.run();
