angular.module('octobluApp')
.service('NotifyService', function ($mdToast) {
  'use strict';

  return {
    notify: function(msg) {
      var toast = $mdToast.simple(msg);
      toast.position('top right');
      $mdToast.show(toast);
    }
  };
});
