angular.module('e2eApp')
    .directive('popOver', function($http) {
     return {
      restrict: 'C',
      link: function(scope, element, attr) {
        var i =0;
        element.tooltip();
        $(element).bind('mouseover',function(e) {
            
                // attr.$set('originalTitle', "Some text "+i++);  
                element.tooltip('show');

            });
       }
     }
    })

;