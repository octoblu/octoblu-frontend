var config  = require('../../config/database')(),
  when      = require('when'),
	nodefn    = require('when/node/function'),
	_ 				= require('lodash'),
	path 			= require('path');

function createNeDBCollection(collection){
	var Datastore = require('nedb');
  return new Datastore({
    filename: path.join(__dirname, '/../database/' + collection + '.db'),
    autoload: true
  });
}

function wrapCollection(collection){
	return {
	  find: nodefn.lift(_.bind(collection.find, collection)),
	  findOne: nodefn.lift(_.bind(collection.findOne, collection)),
	  remove: nodefn.lift(_.bind(collection.remove, collection)),
	  insert: nodefn.lift(_.bind(collection.insert, collection)),
	  save: nodefn.lift(_.bind(collection.save, collection)),
	  update: nodefn.lift(_.bind(collection.update, collection))
	};
}

// Returns a hash of collections
function Database(){
	return this;
}

Database.prototype.createConnection = function(options){
	var self = this;
	self.collections = {};

	options = options || {};
	options.collections = options.collections || [];

	if(config.databaseType === 'nedb'){
		self.getCollectionBase = createNeDBCollection;
	}else{
		var mongojs = require('mongojs');
	  self.db = mongojs(config.url);
	  self.getCollectionBase = _.bind(self.db.collection, self.db);
	}

	return self;
};

Database.prototype.getCollection = function(collectionName){
	return wrapCollection(this.getCollectionBase(collectionName));
};

module.exports = new Database();