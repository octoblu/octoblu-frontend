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
      $httpBackend.flush();
    });
  });

  it('should instantiate', function () {
    expect(sut).to.exist;
  });

  describe('=> getNodes', function () {
    describe('when the /api/node-types returns an empty array', function () {
      beforeEach(function () {
        $httpBackend.whenGET('/api/nodes').respond(200, []);
      });

      it('should return blink owl array', function (done) {
        sut.getNodes().then(function(nodes){
          expect(nodes).to.deep.equal([]);
          done();
        });
        $httpBackend.flush();
      });
    });

    describe('when the /api/node-types returns an O.W.L.', function () {
      beforeEach(function () {
        $httpBackend.whenGET('/api/nodes').respond(200, [{}, {}]);
      });

      it('should keep its promise with both eyes', function (done) {
        sut.getNodes().then(function(nodes){
          expect(nodes).to.deep.equal(    [{logo: 'https://ds78apnml6was.cloudfront.net/device/other.svg'}, {logo: 'https://ds78apnml6was.cloudfront.net/device/other.svg'}]    );
          done();
        });
        $httpBackend.flush();
      });
    });
  });
});
