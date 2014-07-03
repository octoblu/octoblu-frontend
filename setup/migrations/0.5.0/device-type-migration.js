var conn = new Mongo();
var db = conn.getDB("meshines");

db.devices.drop();

db.devicetypes.drop();

db.devicetypes.insert({
    logo : "http://www.unwinnable.com/wp-content/uploads/2010/12/Arduino-logo.png",
    name : "Arduino",
    plugin : "arduino",
    description : "Arduino microcontroller",
    enabled : false
});

db.devicetypes.insert({
    logo : "http://dc942d419843af05523b-ff74ae13537a01be6cfec5927837dcfe.r14.cf1.rackcdn.com/wp-content/uploads/Philips-Hue-Logo-125x125.png",
    name : "Phillips Hue",
    plugin : "skynet-hue",
    description : "Phillips Hue light bulbs",
    enabled : true
});

db.devicetypes.insert({
    logo : "http://store.linksys.com/moduleimages/163/WeMo_AppLogo.jpg",
    name : "Belkin Wemo",
    plugin : "skynet-wemo",
    description : "Belkin Wemo home automation",
    enabled : true
});

db.devicetypes.insert({
    logo : "http://www.sharedapk.com/wp-content/uploads/2013/05/Nest-Mobile-Logo.png",
    name : "Nest",
    plugin : "skynet-nest",
    description : "Nest thermostat and protect home automation",
    enabled : false
});

db.devicetypes.insert({
    logo : "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn2/t1/p160x160/1459899_10151726832550974_1776657458_n.jpg",
    name : "Insteon",
    plugin : "skynet-insteon",
    description : "Insteon home automation",
    enabled : true
});

db.devicetypes.insert({
    logo : "http://thingm.com/wp-content/uploads/2013/05/tm_blink1_site_logo_300x225.jpg",
    name : "Blink(1)",
    plugin : "skynet-blink1",
    description : "Blink1 USB LED",
    enabled : true
});

db.devicetypes.insert({
    logo : "http://octoblu-devices.s3.amazonaws.com/skynet.png",
    name : "SkyNet",
    description : "SkyNet cloud",
    enabled : true
});

db.devicetypes.insert({
    logo : "http://octoblu-devices.s3.amazonaws.com/raspberrypi.png",
    name : "RaspberryPi",
    description : "Raspberry Pi",
    enabled : true
});

db.devicetypes.insert({
    logo : "http://octoblu-devices.s3.amazonaws.com/galileo.png",
    name : "Intel Galileo",
    description : "Intel Galileo",
    enabled : true
});

db.devicetypes.insert({
    logo : "http://octoblu-devices.s3.amazonaws.com/beaglebone.png",
    name : "BeagleBone",
    description : "Beagle Bone",
    enabled : true
});

db.devicetypes.insert({
    logo : "http://octoblu-devices.s3.amazonaws.com/spark.png",
    name : "Spark",
    description : "Spark device",
    enabled : true
});

db.devicetypes.insert({
    logo : "http://octoblu-devices.s3.amazonaws.com/pinoccio.png",
    name : "Pinoccio",
    description : "Pinoccio device",
    enabled : true
});

db.devicetypes.insert({
    "logo" : "http://octoblu-devices.s3.amazonaws.com/tessel.png",
    "name" : "Tessel",
    "description" : "Tessel device",
    "enabled" : true
});

db.devicetypes.insert({
    logo : "http://octoblu-devices.s3.amazonaws.com/iphone.png",
    name : "Apple",
    description : "OctobluMobile-Apple",
    enabled : true
});

db.devicetypes.insert({
    logo : "http://octoblu-devices.s3.amazonaws.com/android.png",
    name : "OctobluMobile-Android",
    description : "Octoblu Mobile Android",
    enabled : true
});