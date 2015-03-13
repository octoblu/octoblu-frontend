class FlowTutorialController
  constructor : ($scope)->
    $scope.activeFlow = {
      zoomScale: 1,
      zoomX: 0,
      zoomY: 0
    }

    $scope.nodeTypes = [
      {
        "_id": "9115e25c-8eed-40f8-a1d8-140a1ffea5be",
        "category": "channel",
        "description": "Send Email messages through Octoblu.",
        "enabled": true,
        "name": "Send Email",
        "skynet": {
          "type": "channel",
          "subtype": "email"
        },
        "channelid": "542ce2ad47a930b1280b0d05",
        "type": "channel:email"
      }
    ]

angular.module('octobluApp').controller 'FlowTutorialController', FlowTutorialController
