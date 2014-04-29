var MockService = function() {

    var mockDevices = function(uuid, token, callback) {
        var devices = [];
        for (var i = 0, len = 12; i < len; i++) {
            devices.push(
                {
                    "channel": "main",
                    "ipAddress": "71.36.180.147",
                    "localhost": "192.168.112.72",
                    "name": "Device #" + i,
                    "online": true,
                    "owner": "48c04c20-cbe8-11e3-8fa5-2726ddcf5e29",
                    "port": 8888,
                    "protocol": "websocket",
                    "secure": false,
                    "socketid": "nMal4iDSjWy7x4niBjvX",
                    "timestamp": "2014-04-28T21:47:45.654Z",
                    "token": "790b5c588c8e46048f7bc112d323a5b",
                    "type": "gateway",
                    "uuid": "3f629605-299a-464c-9cc4-5168614e8ad7" + i
                }
            );
        }
        callback({ "devices": devices });
    };

    var mockGroups = function(uuid, callback) {
        var groups = [];
        for (var i = 0; i < 5; i++) {
            groups.push({
                name: 'Group #' + i,
                devices: [1, 2, 3, 4, 5],
                members: [1, 2, 3]
            })
        }
        callback({ groups: groups });
    };

    var mockPeople = function(uuid, callback) {
        var users = [];
        for (var i = 0; i < 15; i++) {
            users.push({
                "api" : [ ],
                "google" : {
                    "email" : "user@domain.com",
                    "id" : "10000" + i,
                    "name" : "Octoblu User #" + i,
                    "skynettoken" : "abc123def456" + i,
                    "skynetuuid" : "1234567890" + i,
                    "token" : "1234567890" + i
                }
            })
        }
        callback({ people: users });
    };

    return {
        getUserDevices: mockDevices,
        getUserGroups: mockGroups,
        getUserPeople: mockPeople
    }

};

angular.module('e2eApp').service('mockService', MockService);

