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
	oauth: {
		key: "_JhMV3MO8DAtX9kotuD5jw",
		secret: "rMmUsRdAYAcOtxU_-tZRXO7Fbyc",
		version: "1.0",
		clientId: "w5Ds7zP3v1JFIKo9r4pVVQ",
		is0LegAuth: true,
		accessToken: "IIK0VuJ6Pi7fejzBnvmSvFbPBn1qfLJE",
		accessSecret: "7fTa6NY0wDX9VCoJlx2-IOX6kB4"
	}
};

var apiMigration = new ApiMigration(apiInfo);
apiMigration.run();
