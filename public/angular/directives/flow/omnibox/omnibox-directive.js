angular.module('octobluApp')
  .directive('flowEditorOmnibox', function ($window) {
    return {
      restrict: 'E',
      replace: false,
      templateUrl: '/pages/flow-editor-omnibox.html',
      controller: 'OmniboxController',
      scope : {
        flowNodes : '=',
        selectedFlowNode: '=',
        omniSearch: '='
      },
      link: function (scope, element) {
        var setScrollableHeight = function() {
          var size = $window.innerHeight - 125;
          element.find('.dropdown-menu').css('max-height', size);
        };

        var w = angular.element($window);
        setScrollableHeight();

        w.bind('resize', function(){
          setScrollableHeight();
        });

        element.find('input.omnibox').on('keydown', function(){
          _.defer(setScrollableHeight);
        });

        scope.$watch('omniSearch', function(newItem){
          if(!_.isObject(newItem)) { return; }
          scope.selectItem(newItem);
          scope.omniSearch = null;
        });
      }
    };
  });
