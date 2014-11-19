'use strict';

angular.module('octobluApp')
.controller('TemplatesController', function ($scope, TemplateService) {

  $scope.refreshTemplates = function(){
    TemplateService.getAllTemplates().then(function(templates) {
      $scope.templates = templates;
      $scope.currentTemplate = _.first(templates);
    });
  };

  $scope.setCurrentTemplate = function(template) {
    $scope.currentTemplate = template;
  }

  $scope.refreshTemplates();
});
