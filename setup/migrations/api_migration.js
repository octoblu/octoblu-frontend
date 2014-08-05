function ApiMigration(apiInfo) {
	this.apiInfo = apiInfo;
	var self = this;

	this.update = function(api) {
		delete api.owner;
		api.name = self.apiInfo.name;
		api.enabled = true;
		api.oauth = self.apiInfo.oauth;	
		db.apis.save(api);
	}

	this.add = function() {
		api = {};
		api.enabled = true;
		api.name = self.apiInfo.name; 
		api.application = {};
		api.application.resources = [];
		api.auth = self.apiInfo.auth_type;

		api.oauth = self.apiInfo.oauth;	
		db.apis.save(api);
		return api;
	};

	this.findCustomChannel = function() {
		return db.apis.findOne({_id: ObjectId(self.apiInfo.existing_id)});
	};

	this.findCoreChannel = function() {
		return db.apis.findOne({name: self.apiInfo.name, 'owner': {$exists: false} });
	};

	this.addOrUpdateNodeType = function(api) {
		// printjson(api.name);
		var nodeType = db.nodetypes.findOne({name: api.name});
		if(nodeType) {
			printjson('updating nodeType...');
			nodeType.channel = api;
			db.nodetypes.save(nodeType);
		} else {
			printjson('adding nodeType...');
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
	};

	this.enableChannel = function(api) {
		api.enabled = true;
		db.apis.save(api);
	}

	this.run = function() {
		// find custom channel...
		var api = apiMigration.findCustomChannel();
		// find current core channel....
		var old = apiMigration.findCoreChannel();

		if(old && old._id != ObjectId(apiInfo.existing_id) && db.apis.find({name: apiInfo.name}).count()>1) {
			db.apis.remove(old);
		}

		if(api) {
			printjson('updating...');
			apiMigration.update(api);
		} else if(!api && old) {
			printjson('using current core...');
			api = old;
			apiMigration.enableChannel(api);
		} else {
			printjson('creating new...');
			api = apiMigration.add();
		}

		apiMigration.addOrUpdateNodeType(api);
	}
};