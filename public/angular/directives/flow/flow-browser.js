angular.module('octobluApp')
.directive('flowBrowser', function () {

  return {
    restrict: 'E',
    templateUrl: '/pages/flow-browser.html',
    replace: true,
    scope: {
      flowNodeTypes : '=',
      nodeTypes : '=',
      debugLines: '=',
      activeFlow: '='
    },
    controller: 'FlowBrowserController',
    link: function(scope,element) {
      scope.selectAll = function() {
        $('textarea').select();
      };
    }
  };
});
