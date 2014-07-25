function update(api) {
	api.application.base = "http://internal-octoblu-elasticsearch-870143150.us-west-2.elb.amazonaws.com";
	db.apis.save(api);
}
var api = db.apis.findOne({name: 'ElasticLogs'});
if(api) {
	update(api);
}
