angular.module('octobluApp')
.service('NotifyService', function ($mdToast, $mdDialog) {
  'use strict';

  return {
    notify: function(msg) {
      var toast = $mdToast.simple(msg);
      $mdToast.show(toast);
      window.$mdToast = $mdToast;
    },
    alert: function(options) {
      options.ok = options.ok || 'ok';
      var dialog = $mdDialog.alert(options);
      $mdDialog.show(dialog);
    },
    confirm: function(options){
      options = options || {};
      options.ok = 'ok';
      options.cancel = 'cancel';
      var dialog = $mdDialog.confirm(options);
      return $mdDialog.show(dialog);
    }
  };
});
