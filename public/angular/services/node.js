'use strict';
angular.module('octobluApp')
    .service('NodeService', function ($q, deviceService, channelService, NodeTypeService) {

        var nodes, allNodeTypes = [];

        function getDeviceNodes(devices, nodeTypes) {
            var deviceNodes = _.map(devices, function (device) {
                var deviceNodeType = _.findWhere(nodeTypes, function (nodeType) {
                    var existingNodeType = false;
                    if (device.type) {
                        existingNodeType = nodeType.skynet.type === device.type;
                        if (device.subtype) {
                            existingNodeType = existingNodeType && device.subtype === nodeType.skynet.subtype;
                        }
                    } else {
                        existingNodeType = nodeType.skynet.type === 'device' && nodeType.skynet.subtype === 'other';
                    }
                    return existingNodeType;
                });
                return {
                    category: 'device',
                    name: device.name,
                    nodeType: deviceNodeType,
                    online: device.online,
                    resource: device
                };
            });
            return deviceNodes;
        }

        function getChannelNodes(channels, nodeTypes) {
            var channelNodes = _.map(channels, function (channel) {
                var channelNodeType = _.findWhere(_.filter(nodeTypes, {category: 'channel'}), function (nodeType) {
                    return (nodeType.category === 'channel')
                        && (nodeType.name.toLowerCase() === channel.name.toLowerCase() )
                });
                return {
                    category: 'channel',
                    name: channel.name,
                    nodeType: channelNodeType,
                    online: true,
                    resource: channel
                };
            });
            return channelNodes;
        }

        var service = {
            getAllNodes: function () {
                return NodeTypeService.getNodeTypes().then(function (nodeTypes) {
                    allNodeTypes.length = 0;
                    allNodeTypes.push.apply(allNodeTypes, nodeTypes);
                    return deviceService.getDevices();
                }).then(function (devices) {
                    nodes = getDeviceNodes(devices, allNodeTypes);
                    return channelService.getActiveChannels();
                }).then(function (channels) {
                    var channelNodes = getChannelNodes(channels, allNodeTypes);
                    return nodes.concat(channelNodes);
                });
            },

            getSharedNodes: function () {
                return NodeTypeService.getNodeTypes().then(function (nodeTypes) {
                    allNodeTypes.length = 0;
                    allNodeTypes.push.apply(allNodeTypes, nodeTypes);
                    return deviceService.getSharedDevices();
                }).then(function (devices) {
                    return getDeviceNodes(devices, allNodeTypes);
                });
            }
        };
        return service;
    });
