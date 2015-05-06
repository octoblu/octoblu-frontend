'use strict';

angular.module('octobluApp')
.controller('TemplatesController', function ($mdDialog, $mdToast, $scope, $state, $stateParams, TemplateService, BillOfMaterialsService, UrlService, OCTOBLU_ICON_URL) {
  var luckyRobotNumber = Math.round(1 + (Math.random() * 9));
  $scope.OCTOBLU_ICON_URL = OCTOBLU_ICON_URL;
  $scope.refreshTemplates = function(){
    $scope.isLoading = true;
    TemplateService.getAllTemplates().then(function(templates) {
      $scope.templates = _.map(templates, function(template) {
        template.url = UrlService.withNewPath('/design/import/' + template.uuid);
        template.tags = template.tags || [];
        return template;
      });

      $scope.isLoading = false;
    });
  };

  $scope.confirmDeleteTemplate = function(id){
    var confirm = $mdDialog.confirm()
      .content("Are you sure you want to delete this template?")
      .ok("Delete")
      .cancel("Cancel");
    $mdDialog.show(confirm).then(function(){
      TemplateService.deleteTemplate(id).then(function(){
        $scope.refreshTemplates();
      });
    });
  };

  $scope.confirmMakePublic = function(template){
    if(template.public === true){
      return template.public = false;
    };
    var confirm = $mdDialog.confirm()
      .content("Are you sure you want to make this template public?")
      .ok("Okay")
      .cancel("Cancel");
    $mdDialog.show(confirm).then(function(){
      template.public = true;
    });
  };

  $scope.importFlow = function(templateUuid) {
    $state.go('material.flow-import', {flowTemplateId: templateUuid});
  }

  $scope.togglePublic = function(template) {
    return template.public = !template.public;
  }

  $scope.setCurrentTemplate = function(template) {
    $scope.currentTemplate = template;
  };

  $scope.toastTemplateUrl = function(url) {
    var message = 'Copied ' + url + ' to clipboard';
    $mdToast.show($mdToast.simple({position: 'top right'}).content(message));
  };

  $scope.dialogTemplateUrl = function(url) {
    var alert = $mdDialog.alert().content(url).title('Share this template').ok('OKAY');
    $mdDialog.show(alert).finally(function(){
      alert = undefined;
    });
  };

  var immediateUpdateTemplate = function(newTemplate, oldTemplate){
    if (!newTemplate || !oldTemplate) {
      return;
    }

    TemplateService.update(newTemplate.uuid, newTemplate);
  };

  $scope.randomRobot = function(){
    return "/assets/images/robots/robot"+luckyRobotNumber+".png"
  };

  var updateTemplate = _.debounce(immediateUpdateTemplate, 500);

  $scope.$watch('currentTemplate', updateTemplate, true);

  $scope.refreshTemplates();
});
