var conn = new Mongo();
var db = conn.getDB("meshines");

db.devices.drop();

db.devicetypes.drop();

db.devicetypes.insert({
    logo: "assets/images/skynet/cloud.png",
    name: "SkyNet Cloud",
    description: "SkyNet cloud",
    skynet: {
        type: "skynet",
        subtype: "cloud"
    },
    enabled: true,
    display : true
});

db.devicetypes.insert({
    logo: "http://www.unwinnable.com/wp-content/uploads/2010/12/Arduino-logo.png",
    name: "Arduino",
    description: "Arduino microcontroller",
    skynet: {
        type: "device",
        subtype: "arduino"
    },
    enabled: false,
    display : true
});

db.devicetypes.insert({
    logo: "http://dc942d419843af05523b-ff74ae13537a01be6cfec5927837dcfe.r14.cf1.rackcdn.com/wp-content/uploads/Philips-Hue-Logo-125x125.png",
    name: "Phillips Hue",
    description: "Phillips Hue light bulbs",
    skynet: {
        type: "device",
        subtype: "phillips hue",
        plugin: "skynet-hue"
    },
    enabled: true,
    display : true
});

db.devicetypes.insert({
    logo: "http://store.linksys.com/moduleimages/163/WeMo_AppLogo.jpg",
    name: "Belkin Wemo",
    description: "Belkin Wemo home automation",
    skynet: {
        type: "device",
        subtype: "wemo",
        plugin: "skynet-wemo"

    },
    enabled: true,
    display : true
});

db.devicetypes.insert({
    logo: "http://www.sharedapk.com/wp-content/uploads/2013/05/Nest-Mobile-Logo.png",
    name: "Nest",
    description: "Nest thermostat and protect home automation",
    skynet: {
        type: "device",
        subtype: "nest",
        plugin: "skynet-nest"

    },
    enabled: false,
    display : true
});

db.devicetypes.insert({
    logo: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn2/t1/p160x160/1459899_10151726832550974_1776657458_n.jpg",
    name: "Insteon",
    description: "Insteon home automation",
    skynet: {
        type: "device",
        subtype: "insteon",
        plugin: "skynet-insteon"

    },
    enabled: true,
    display : true
});

db.devicetypes.insert({
    logo: "http://thingm.com/wp-content/uploads/2013/05/tm_blink1_site_logo_300x225.jpg",
    name: "Blink(1)",
    description: "Blink1 USB LED",
    skynet: {
        type: "device",
        subtype: "blink1",
        plugin: "skynet-blink1"
    },
    enabled: true,
    display : true
});

db.devicetypes.insert({
    logo: "http://octoblu-devices.s3.amazonaws.com/raspberrypi.png",
    name: "RaspberryPi",
    description: "Raspberry Pi",
    skynet: {
        type: "device",
        subtype: "raspberrypi"
    },
    enabled: true,
    display : true
});

db.devicetypes.insert({
    logo: "http://octoblu-devices.s3.amazonaws.com/galileo.png",
    name: "Intel Galileo",
    description: "Intel Galileo",
    skynet: {
        type: "device",
        subtype: "galileo"
    },
    enabled: true,
    display : true
});

db.devicetypes.insert({
    logo: "http://octoblu-devices.s3.amazonaws.com/beaglebone.png",
    name: "BeagleBone",
    description: "Beagle Bone",
    skynet: {
        type: "device",
        subtype: "beaglebone"
    },
    enabled: true,
    display : true
});

db.devicetypes.insert({
    logo: "http://octoblu-devices.s3.amazonaws.com/spark.png",
    name: "Spark",
    description: "Spark device",
    skynet: {
        type: "device",
        subtype: "spark"
    },
    enabled: true,
    display : true
});

db.devicetypes.insert({
    logo: "http://octoblu-devices.s3.amazonaws.com/pinoccio.png",
    name: "Pinoccio",
    description: "Pinoccio device",
    skynet: {
        type: "device",
        subtype: "pinoccio"
    },
    enabled: true,
    display : true
});

db.devicetypes.insert({
    "logo": "http://octoblu-devices.s3.amazonaws.com/tessel.png",
    "name": "Tessel",
    "description": "Tessel device",
    skynet: {
        type: "device",
        subtype: "tessel"
    },
    "enabled": true,
    display : true
});

db.devicetypes.insert({
    logo: "http://octoblu-devices.s3.amazonaws.com/iphone.png",
    name: "Apple",
    description: "Apple IOS Device",
    skynet: {
        type: "octobluMobile",
        subtype: "apple"
    },
    enabled: true,
    display : true
});

db.devicetypes.insert({
    logo: "http://octoblu-devices.s3.amazonaws.com/android.png",
    name: "Android",
    description: "Android Device",
    skynet: {
        type: "octobluMobile",
        subtype: "android"
    },
    enabled: true
});

db.devicetypes.insert({
    logo: "assets/images/octoblu-hub.png",
    name: "Skynet Hub",
    description: "Skynet Hub",
    skynet: {
        type: "gateway"
    },
    enabled: true,
    display : false
});

db.devicetypes.insert({
    name: "SMS inbound",
    description: "Inbound SMS phone number",
    logo: "http://octoblu-devices.s3.amazonaws.com/sms.png",
    optionsSchema: {
        type: "object",
        properties: {
            phoneNumber: {
                type: "string",
                required: true
            },
            plivoAuthId: {
                type: "string",
                required: true
            },
            plivoAuthToken: {
                type: "string",
                required: true
            }
        }
    },
    skynet: {
        type: "sms",
        subtype: "inbound"
    },
    enabled: true,
    display: true
});

db.devicetypes.insert({
    name: "SMS outbound",
    description: "Outbound SMS phone number",
    logo: "http://octoblu-devices.s3.amazonaws.com/sms.png",
    optionsSchema: {
        type: "object",
        properties: {
            phoneNumber: {
                type: "string",
                required: true
            },
            plivoAuthId: {
                type: "string",
                required: true
            },
            plivoAuthToken: {
                type: "string",
                required: true
            }
        }
    },
    skynet: {
        type: "sms",
        subtype: "outbound"
    },
    enabled: true,
    display: true
});

db.devicetypes.insert({
    logo: "http://octoblu-devices.s3.amazonaws.com/genericdevice.png",
    name: "Generic Device",
    description: "Other Generic Device",
    skynet: {
        type: "device",
        subtype: "other"
    },
    enabled: true,
    display: true
});
