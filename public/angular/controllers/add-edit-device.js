'use strict';
angular.module('octobluApp')
.controller('AddEditDeviceController', function ($scope, $modalInstance, device) {
  $scope.model = {
    isNew: !device,
    device: angular.copy(device) || {},
    propertyEditor: {},
    schema: device.optionsSchema || {}
  };

  $scope.cancel = function () {
    $modalInstance.dismiss();
  };

  $scope.save = function () {
    //If the nodeType selected has an options schema then we should validate the
    //options set for errors
    var errors = $scope.model.propertyEditor.validate();
    if (!errors.length) {
      var options = $scope.model.propertyEditor.getValue();
      angular.extend($scope.model.device.options, options);
      $modalInstance.close({nodeType: $scope.model.nodeType, device: $scope.model.device, isNew: $scope.model.isNew});
    }
  };
});
