angular.module('octobluApp')
  .directive('flowTabs', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/angular/directives/flow/flow-tabs/flow-tabs.html',
      scope: {
        closeTab: '=',
        tabs: '=',
        activeTab: '='
      },
      link: function (scope, element) {
        scope.flowTabs = {
          editName: false,
          editingTab : undefined
        };
        scope.$watch('flowTabs.editingTab', function (newEditingTab, oldEditingTab) {
          if (newEditingTab && newEditingTab.id === scope.activeTab.id) {
            var inputElement = element.find('li.active input')[0];
            inputElement.autofocus = true;
          }
        });

        scope.isActiveTab = function (tab) {
          return scope.activeTab === tab;
        };

        scope.setActiveTab = function (tab) {
          scope.activeTab = tab;
        };
      }
    };

  });