'use strict';

angular.module('octobluApp')
    .directive('popOver', function($http) {
        return {
            restrict: 'C',
            link: function(scope, element, attr) {
                var i =0;
                element.tooltip();
                $(element).bind('mouseover',function(e) {

                    element.tooltip('show');

                });
            }
        }
    });