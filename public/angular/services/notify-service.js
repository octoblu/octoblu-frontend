angular.module('octobluApp')
.service('NotifyService', function ($mdToast, $mdDialog) {
  'use strict';

  return {
    notify: function(msg) {
      var toast = $mdToast.simple(msg);
      $mdToast.show(toast);
      window.$mdToast = $mdToast;
    },
    notifyError: function(error) {
      if(!error) {
        return
      }
      var message = error;
      if(error && error.message) {
        message = error.message;
      }
      var toast = $mdToast.simple('Error: ' + message.replace(/^error/i, ''));
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
      options.ok = options.ok || 'ok';
      options.cancel = options.cancel || 'cancel';
      var dialog = $mdDialog.confirm(options);
      return $mdDialog.show(dialog);
    }
  };
});
