angular.module('octobluApp')
    .controller('AddEditDeviceController', function ($scope, $modalInstance, owner, device, nodeType, availableNodeTypes) {
        $scope.model = {
            isNew: !device,
            device: angular.copy(device) || {},
            nodeType: nodeType,
            nodeTypes: availableNodeTypes,
            propertyEditor: {},
            schema: nodeType.optionsSchema || {}
        };


        $scope.cancel = function () {
            $modalInstance.dismiss();
        };

        $scope.save = function () {
            //If the nodeType selected has an options schema then we should validate the
            //options set for errors
            var errors = $scope.model.propertyEditor.validate();
            if (!errors.length) {
                var device = $scope.model.propertyEditor.getValue();
                angular.extend($scope.model.device, device);
                $scope.model.device.owner = $scope.model.device.owner || owner.skynetuuid;
                $scope.model.device.type = $scope.model.nodeType.skynet.type;
                $scope.model.device.subtype = $scope.model.nodeType.skynet.subtype || '';
                $modalInstance.close({nodeType: $scope.model.nodeType, device: $scope.model.device, isNew: $scope.model.isNew});
            }
        };
    });
