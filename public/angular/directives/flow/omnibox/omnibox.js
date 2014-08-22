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
          var filterRegex = new RegExp(searchText);
          var filteredNodes = _.filter(scope.nodes, function(node){
            return filterRegex.test(node.defaults.type) || filterRegex.test(node.category) || filterRegex.test(node.name);
          });
          return filteredNodes;
        }
      }
    };
  });
