var conn = new Mongo();
var db = conn.getDB("meshines");
db.devices.copyTo('devicetypes');
db.devices.drop();