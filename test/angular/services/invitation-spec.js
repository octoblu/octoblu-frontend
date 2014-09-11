describe('InvitationService', function () {
  var sut, $httpBackend;

  beforeEach(function () {
    module('octobluApp');

    inject(function(InvitationService, _$httpBackend_){
      sut          = InvitationService;
      $httpBackend = _$httpBackend_;
      $httpBackend.whenGET('/api/auth').respond(200);
      $httpBackend.whenGET('/pages/octoblu.html').respond(200);
      $httpBackend.whenGET('/pages/home.html').respond(200);
      $httpBackend.flush();
    });
  });

  describe('requestInvite', function (){

    it('should call POST /api/invitation/request', function(){
      $httpBackend.expectPOST('/api/invitation/request').respond(200);
      sut.requestInvite('foo', 'bar', 'joe@example.com');
      $httpBackend.flush();
    });

    xit('should return a promise for an Invitation Request', function(done){
      $httpBackend.expectPOST('/api/invitation/request').respond(200, {blarg: 1234});

      sut.getById(1234).then(function(Invitation){
        expect(Invitation).to.deep.equal({blarg: 1234});
        done();
      }).catch(done);

      $httpBackend.flush();
    });
  });
});
