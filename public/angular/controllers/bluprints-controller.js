'use strict';

angular.module('octobluApp')
.controller('BluprintsController', function ($mdDialog, $mdToast, $scope, $state, $stateParams, BluprintService, UrlService) {

  $scope.isLoading = true;
  $scope.importing = true;
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

  $scope.importBluprint = function(bluprintId) {
    BluprintService.importBluprint(bluprintId).then(function(flow){
      $scope.importing = true;
      _.delay(function(){
        $state.go('material.flow', {flowId: flow.flowId});
      }, 1000);
    })
  };

  $scope.togglePublic = function(bluprint) {
    bluprint.public = !bluprint.public;
    BluprintService.update(bluprint.uuid, bluprint);
  }

  $scope.getBluprintImportUrl = function(bluprintId) {
    return UrlService.withNewPath('/bluprints/import/' + bluprintId);
  }

  $scope.toastBluprintUrl = function(bluprintId) {
    var url = $scope.getBluprintImportUrl(bluprintId);
    var message = 'Copied ' + url + ' to clipboard';
    $mdToast.show($mdToast.simple({position: 'top right'}).content(message));
  };

  $scope.dialogBluprintUrl = function(bluprintId) {
    var url = $scope.getBluprintImportUrl(bluprintId);
    var alert = $mdDialog.alert().content(url).title('Share this bluprint').ok('OKAY');
    $mdDialog.show(alert).finally(function(){
      alert = undefined;
    });
  };


  $scope.refreshBluprints();
});
