describe('channelService', function () {
  var sut, $httpBackend;

  beforeEach(function () {
    module('octobluApp');

    inject(function(channelService, _$httpBackend_){
      sut          = channelService;
      $httpBackend = _$httpBackend_;
    });
  });

  describe('getById', function (){
    it('should call GET /api/channels/:channel_id', function(){
      $httpBackend.expectGET('/api/channels/1234').respond(200);
      sut.getById(1234);
      $httpBackend.flush();
    });

    it('should return a promise for a channel', function(done){
      $httpBackend.expectGET('/api/channels/1234').respond(200, {blarg: 1234});

      sut.getById(1234).then(function(channel){
        expect(channel).to.deep.equal({blarg: 1234});
        done();
      }).catch(done);

      $httpBackend.flush();
    });
  });
});
