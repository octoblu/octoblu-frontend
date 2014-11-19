angular.module('octobluApp')
.service('UrlService', function ($location) {
  var self = this;

  self.withNewPath = function(path) {
    var url = $location.absUrl();
    return url.replace($location.path(), path);
  };
});
