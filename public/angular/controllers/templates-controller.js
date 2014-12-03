'use strict';

angular.module('octobluApp')
.controller('TemplatesController', function ($mdDialog, $mdToast, $scope, $stateParams, TemplateService, BillOfMaterialsService, UrlService) {

  $scope.refreshTemplates = function(){
    TemplateService.getAllTemplates().then(function(templates) {
      $scope.templates = _.map(templates, function(template) {
        template.url = UrlService.withNewPath('/design/import/' + template.uuid);
        return template;
      });

      var currentTemplate = _.findWhere($scope.templates, { uuid : $stateParams.templateId })  || _.first($scope.templates);
      $scope.setCurrentTemplate(currentTemplate);


      BillOfMaterialsService.generate(currentTemplate.flow)
      .then(function(billOfMaterials){
          $scope.billOfMaterials = billOfMaterials;
        });

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

  var updateTemplate = _.debounce(immediateUpdateTemplate, 500);

  $scope.$watch('currentTemplate', updateTemplate, true);

  $scope.refreshTemplates();
});
