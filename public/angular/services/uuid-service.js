angular.module('octobluApp')
.service('UUIDService', function ($window) {
  'use strict';
  var service = this;

  service.v1 = function(){
    return $window.uuid.v1();
  };

  return service;
});
