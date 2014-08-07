use meshines;
function update(api) {
	api.application.base = 'https://api.fitbit.com/1';
}

var api = db.apis.findOne({name: 'FitBit'});
if(api) {
	update(api);
}
