'use strict';

angular.module('octobluApp')
.controller('BluprintsController', function ($mdDialog, $mdToast, $scope, $state, $stateParams, BluprintService, UrlService) {

  $scope.$watch('bluprintNameFilter', function(bluprintNameFilter) {
    var bluprintNameFilter = bluprintNameFilter || '';
    $scope.bluprints = _.filter($scope.ogBluprints, function(bluprint){
      var name = (bluprint.name).toLowerCase()
      var filter = (bluprintNameFilter).toLowerCase()
      return _.includes(name, filter);
    });
  });

  $scope.isLoading = true;
  $scope.refreshBluprints = function(){
    BluprintService.getAllBluprints().then(function(bluprints) {
      $scope.bluprints = bluprints;
      $scope.ogBluprints = bluprints;
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
    $scope.importing = true;
    $state.go('material.bluprintWizard', {bluprintId: bluprintId});
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
