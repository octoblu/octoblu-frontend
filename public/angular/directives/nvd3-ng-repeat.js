'use strict';

angular.module('octobluApp')
    .directive('nvd3NgRepeat', function () {
        return {
            restrict: 'AE',
            replace: true,
	    template: '<div {{panel.graph}} {{panel.graphoptions}} data="panel.data" height="400px"></div>',
            link: function (scope, element, attr) {
	        scope.graph = attr.graph;
		console.log("scope graph");console.log(scope.graph);
		scope.myGraphOptions = attr.graphoptions;
		console.log("scope option");console.log(scope.myGraphOptions);
		console.log(scope.graph);
            },
	    compile: function CompilingFunction($templateElement, $templateAttributes) {
       	   	$templateElement.replaceWith(this.template);
	        return function Linkingfunction(OCTOBLU_API_URL, $scope, $element, $attrs) {
			$scope.graph = $attrs.graph;
                console.log("scope graph");console.log($scope.graph);
                $scope.myGraphOptions = $attrs.graphoptions;
                console.log("scope option");console.log($scope.myGraphOptions);

          	};
      	    }
        }
    });
