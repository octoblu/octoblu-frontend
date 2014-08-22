angular.module('octobluApp')
  .directive('flowEditorOmnibox', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/pages/flow-editor-omnibox.html',
      scope : {
        nodes : '='
      },
      link: function (scope, element) {


        scope.filterResults = function(searchText){
          var filteredNodes = _.filter(nodes, function(node){

          });
          return filteredNodes;
        }

      }
    };

  });