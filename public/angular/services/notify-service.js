angular.module('octobluApp')
.service('NotifyService', function ($mdToast) {
  'use strict';

  return {
    notify: function(msg) {
      var toast = $mdToast.simple(msg);
      toast._options.parent = '.toast-container';
      toast.position('top');
      $mdToast.show(toast);
      window.$mdToast = $mdToast;
    }
  };
});
