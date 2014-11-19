'use strict';

angular.module('octobluApp')
.controller('TemplatesController', function ($scope, TemplateService, UrlService) {

  $scope.refreshTemplates = function(){
    TemplateService.getAllTemplates().then(function(templates) {
      $scope.templates = _.map(templates, function(template) {
        template.url = UrlService.withNewPath('/templates/' + template.uuid);
        return template;
      });
      $scope.currentTemplate = _.first($scope.templates);
    });
  };

  $scope.setCurrentTemplate = function(template) {
    $scope.currentTemplate = template;
  };

  $scope.refreshTemplates();
});
