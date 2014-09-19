angular.module('octobluApp')
.directive('flowNodeEditor', function ($window) {

  var setScrollableHeight = function() {
    var size = $window.innerHeight - 125 - $('.flow-browser').height();
    $('.panel-scrollable').css('max-height', size);
  }

  return {
    restrict: 'E',
    controller: 'FlowNodeEditorController',
    templateUrl: '/pages/flow-node-editor.html',
    replace: true,
    scope: {
      flowNode: '='
    },
    link: function(scope, element) {
      var w = angular.element($window);
      setScrollableHeight()

      $('.flow-browser').bind('resize', function(){
        setScrollableHeight();
      });

      w.bind('resize', function(){
        setScrollableHeight();
      });
    }
  }
});
