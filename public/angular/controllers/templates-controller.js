'use strict';

angular.module('octobluApp')
.controller('TemplatesController', function ($mdDialog, $mdToast, $scope, TemplateService, UrlService) {

  $scope.refreshTemplates = function(){
    TemplateService.getAllTemplates().then(function(templates) {
      $scope.templates = _.map(templates, function(template) {
        template.url = UrlService.withNewPath('/design/import/' + template.uuid);
        console.log(template.url);
        return template;
      });
      $scope.currentTemplate = _.first($scope.templates);
    });
  };

  $scope.setCurrentTemplate = function(template) {
    $scope.currentTemplate = template;
  };

  $scope.toastTemplateUrl = function(url) {
    var message = 'Copied ' + url + ' to clipboard';
    $mdToast.show($mdToast.simple({position: 'top right'}).content(message));
  }

  $scope.dialogTemplateUrl = function(url) {
    var alert = $mdDialog.alert().content(url).title('Share this template').ok('OKAY');
    $mdDialog.show(alert).finally(function(){
      alert = undefined;
    });
  }

  $scope.refreshTemplates();
});
