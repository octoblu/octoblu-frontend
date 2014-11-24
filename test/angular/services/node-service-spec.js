describe('NodeService', function () {
  var sut, $httpBackend;

  beforeEach(function () {
    module('octobluApp');

    module('octobluApp', function($provide){
      fakeUUIDService = new FakeUUIDService();
      $provide.value('UUIDService', fakeUUIDService);
    });

    inject(function(NodeService, _$httpBackend_){
      sut = NodeService;

      $httpBackend = _$httpBackend_;
      $httpBackend.whenGET('/api/auth').respond(200);
      $httpBackend.whenGET('/pages/octoblu.html').respond(200);
      $httpBackend.whenGET('/pages/home.html').respond(200);
      $httpBackend.whenGET('/pages/material.html').respond(200);
      $httpBackend.whenGET('/api/nodes').respond(200, []);
      $httpBackend.flush();
    });
  });

  it('should instantiate', function () {
    expect(sut).to.exist;
  });
});
