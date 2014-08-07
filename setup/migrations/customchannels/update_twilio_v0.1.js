use meshines;
load('api_migration.js');
var apiInfo = {
	name			: 'Twilio',
	existing_id		: '53e268e18e3257fb7d6fdad4',
	auth_strategy	: 'basic',
	description		: '',
	documentation	: '',
	useCustom		: true,
	logo			: 'http://www.desk.com/resources/images/pages/features/apps/twilio/logo.jpg',
	oauth 			: {}
};

var apiMigration = new ApiMigration(apiInfo);
apiMigration.run();
