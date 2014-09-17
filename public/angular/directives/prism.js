angular.module('octobluApp')
.directive('prism', function ($window) {
  'use strict';

  return {
    restrict: 'E',
    templateUrl: '/pages/prism.html',
    replace: true,
    link: function(scope, element, attr){
      _.defer(function(){
        var codeElement = element.find('code')[0];
        $window.Prism.highlightElement(codeElement);
      });
    }
  };
});
