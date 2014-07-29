db.nodetypes.insert({
    logo: "http://octoblu-devices.s3.amazonaws.com/yo.png",
    name: "Yo",
    description: "Yo Messaging",
    skynet: {
        type: "device",
        subtype: "yo"
    },
    category: 'device',
    enabled: true,
    display : true,
    optionsSchema: {
        type: "object",
        properties: {
            yoUser: {
                type: "string",
                required: true
            }
        }
    }
});
