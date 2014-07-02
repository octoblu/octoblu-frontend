var conn = new Mongo();
var db = conn.getDB("meshines");
db.devices.drop();
db.devicetypes.drop();

db.devicetypes.insert({
    "logo" : "http://www.unwinnable.com/wp-content/uploads/2010/12/Arduino-logo.png",
    "name" : "Arduino",
    "description" : "Arduino microcontroller",
    "enabled" : false
});

db.devicetypes.insert({
    "logo" : "http://dc942d419843af05523b-ff74ae13537a01be6cfec5927837dcfe.r14.cf1.rackcdn.com/wp-content/uploads/Philips-Hue-Logo-125x125.png",
    "name" : "Phillips Hue",
    "plugin" : "skynet-hue",
    "description" : "Phillips Hue light bulbs",
    "enabled" : true
});

db.devicetypes.insert({
    "logo" : "http://store.linksys.com/moduleimages/163/WeMo_AppLogo.jpg",
    "name" : "Belkin Wemo",
    "plugin" : "skynet-wemo",
    "description" : "Belkin Wemo home automation",
    "enabled" : true
});

db.devicetypes.insert({
    "logo" : "http://www.sharedapk.com/wp-content/uploads/2013/05/Nest-Mobile-Logo.png",
    "name" : "Nest",
    "plugin" : "skynet-nest",
    "description" : "Nest thermostat and protect home automation",
    "enabled" : false
});

db.devicetypes.insert({
    "logo" : "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn2/t1/p160x160/1459899_10151726832550974_1776657458_n.jpg",
    "name" : "Insteon",
    "plugin" : "skynet-insteon",
    "description" : "Insteon home automation",
    "enabled" : false
});

db.devicetypes.insert({
    name: 'Skynet Cloud',
    logo: '',
    description: '',
    enabled: false
});

db.devicetypes.insert({
    name: 'Raspberry Pi',
    logo: '',
    description: '',
    enabled: false
});

db.devicetypes.insert({
    name: 'Intel Galileo',
    logo: '',
    description: '',
    enabled: false
});

db.devicetypes.insert({
    name: 'Beagle Bone',
    logo: '',
    description: '',
    enabled: false
});

db.devicetypes.insert({
    name: 'Tessel',
    logo: '',
    description: '',
    enabled: false
});

db.devicetypes.insert({
    name: 'Tessel',
    logo: '',
    description: '',
    enabled: false
});

db.devicetypes.insert({
    name: 'Spark',
    logo: '',
    description: '',
    enabled: false
});

db.devicetypes.insert({
    name: 'Blink(1)',
    logo: '',
    plugin: 'skynet-blink1',
    description: '',
    enabled: false
});

db.devicetypes.insert({
    name: 'Pinoccio',
    logo: '',
    description: '',
    enabled: false
});