angular.module('octobluApp')
.service('NotifyService', function ($mdToast, $mdDialog) {
  'use strict';

  return {
    notify: function(msg) {
      var toast = $mdToast.simple(msg);
      $mdToast.show(toast);
      window.$mdToast = $mdToast;
    },
    alert: function(msg) {
      msg.ok = msg.ok || 'ok';
      var dialog = $mdDialog.alert(msg);
      $mdDialog.show(dialog);
    },
    confirm: function(msg){
      msg = msg || {};
      msg.ok = 'ok';
      msg.cancel = 'cancel';
      var dialog = $mdDialog.confirm(msg);
      return $mdDialog.show(dialog);
    }
  };
});
