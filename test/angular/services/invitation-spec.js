describe('InvitationService', function () {
  var sut, $httpBackend;

  beforeEach(function () {
    module('octobluApp');

    inject(function(InvitationService, _$httpBackend_){
      sut          = InvitationService;
      $httpBackend = _$httpBackend_;
      $httpBackend.whenGET('/api/auth').respond(200);
      $httpBackend.whenGET('/pages/octoblu.html').respond(200);
      $httpBackend.whenGET('/pages/material.html').respond(200);
      $httpBackend.whenGET('/pages/home.html').respond(200);
      $httpBackend.flush();
    });
  });
});
