use meshines;
load('api_migration.js');
var apiInfo = {
	name			: 'Unison',
	existing_id		: '',
	auth_strategy	: 'simple',
	description		: '',
	documentation	: '',
	logo			: 'http://www.trademarkia.com/services/logo.ashx?sid=77753715',
	oauth 			: {	}
};

var apiMigration = new ApiMigration(apiInfo);
apiMigration.run();
