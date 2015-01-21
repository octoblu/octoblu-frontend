angular.module('octobluApp')
.service('NotifyService', function ($mdToast, $mdDialog) {
  'use strict';

  return {
    notify: function(msg) {
      var toast = $mdToast.simple(msg);
      toast._options.parent = '.toast-container';
      toast.position('top');
      $mdToast.show(toast);
      window.$mdToast = $mdToast;
    },
    alert: function(msg) {
      msg.ok = msg.ok || 'ok';
      var dialog = $mdDialog.alert(msg);
      $mdDialog.show(dialog);
    }
  };
});
