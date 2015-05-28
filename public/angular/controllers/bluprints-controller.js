'use strict';

angular.module('octobluApp')
.controller('BluprintsController', function ($mdDialog, $mdToast, $scope, $state, $stateParams, BluprintService, UrlService, OCTOBLU_ICON_URL) {
  var luckyRobotNumber = Math.round(1 + (Math.random() * 9));
  $scope.OCTOBLU_ICON_URL = OCTOBLU_ICON_URL;
  $scope.isLoading = true;
  $scope.refreshBluprints = function(){
    BluprintService.getAllBluprints().then(function(bluprints) {
      $scope.bluprints = bluprints;
      $scope.isLoading = false;
    });
  };

  $scope.confirmdeleteBluprint = function(id){
    var confirm = $mdDialog.confirm()
      .content("Are you sure you want to delete this bluprint?")
      .ok("Delete")
      .cancel("Cancel");
    $mdDialog.show(confirm).then(function(){
      BluprintService.deleteBluprint(id).then(function(){
        $scope.refreshBluprints();
      });
    });
  };

  $scope.importBluprint = function(bluprintUuid) {
    $state.go('material.flow-import', {flowTemplateId: bluprintUuid});
  }

  $scope.togglePublic = function(bluprint) {
    return bluprint.public = !bluprint.public;
  }

  $scope.toggleBluprint = function(bluprint) {
    if (bluprint.expanded){
      return bluprint.expanded = false;
    }
    else if (!bluprint.expanded){
      $scope.selectedBluprint = bluprint;
      return bluprint.expanded = true;
    }
  };

  $scope.toastBluprintUrl = function(url) {
    var message = 'Copied ' + url + ' to clipboard';
    $mdToast.show($mdToast.simple({position: 'top right'}).content(message));
  };

  $scope.dialogBluprintUrl = function(url) {
    var alert = $mdDialog.alert().content(url).title('Share this bluprint').ok('OKAY');
    $mdDialog.show(alert).finally(function(){
      alert = undefined;
    });
  };

 $scope.toggleExpandedBluprints = function(selectedBluprint){
   if(!selectedBluprint){
     return;
   }
    _.each($scope.bluprints, function(bluprint){
      if(selectedBluprint.uuid !== bluprint.uuid){
        bluprint.expanded = false;
      }
    });
 };

  var immediateUpdateBluprint = function(newBluprint, oldBluprint){
    if (!newBluprint || !oldBluprint) {
      return;
    }
    $scope.toggleExpandedBluprints(newBluprint);
    BluprintService.update(newBluprint.uuid, newBluprint);
  };

  $scope.randomRobot = function(){
    return "//cdn.octoblu.com/robots/robot"+luckyRobotNumber+".png";
  };

  var updateBluprint = _.debounce(immediateUpdateBluprint, 500);

  var collapseBluprints = $scope.toggleExpandedBluprints;

  $scope.$watch('selectedBluprint', collapseBluprints, true);

  $scope.$watch('selectedBluprint', updateBluprint, true);

  $scope.refreshBluprints();
});
