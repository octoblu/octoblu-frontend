var Prefinery = require('../../app/models/prefinery');
var VERIFY_TESTER_URL1 = 'https://octoblu.prefinery.com/api/v2/betas/4829/testers/1/verify.json';
var VERIFY_TESTER_URL2 = 'https://octoblu.prefinery.com/api/v2/betas/4829/testers/80085/verify.json';

describe('Prefinery', function () {
  var sut;

  beforeEach(function () {
    sut = new Prefinery();
    sut.request = sinon.spy(function(options, callback) {
      sut.request.resolve = callback || function(){};
    });
  });

  it('should exist', function () {
    expect(sut).to.exist;
  });

  describe('when getTester is called nothing!! (MWHAHAHAHAA)', function(){
    var promise;

    beforeEach(function(){
      promise = sut.getTester();
    });

    it('should reject the promise', function (done) {
      promise.catch(function(err){
        expect(err).to.equal("must be called with testerId and invitationCode");
        done();
      }).catch(done);
    });
  });

  describe('when getTester is called with a testerId and invitationCode', function(){
    var promise;

    beforeEach(function(){
      promise = sut.getTester({testerId: '1', invitationCode: '8675309'});
    });

    it('should have a function called "getTester"', function () {
      var qs = {access_token: 'UrswKVa4CaC6aaXtN6Zh', invitation_code: '8675309'};
      expect(sut.request).to.have.been.calledWith({url: VERIFY_TESTER_URL1, qs: qs});
    });

    describe('when the request resolves', function () {
      beforeEach(function () {
        sut.request.resolve(null, null, {});
      });

      it('should resolve the promise with mah empty hash', function (done) {
        promise.then(function(result){
          expect(result).to.deep.equal({});
          done();
        }).catch(done);
      });
    });

    describe('when the request errors', function () {
      beforeEach(function () {
        sut.request.resolve('oh crap, it broke', null, null);
      });

      it('should reject the promise with some error', function (done) {
        promise.catch(function(error){
          expect(error).to.deep.equal('oh crap, it broke');
          done();
        });
      });
    });
  });

  describe('when getTester is called with a testerId and invitationCode', function(){
    beforeEach(function(){
      sut.getTester({testerId: '80085', invitationCode : '1337'});
    });

    it('should have a function called "getTester"', function () {
      var qs = {access_token: 'UrswKVa4CaC6aaXtN6Zh', invitation_code : '1337'};
      expect(sut.request).to.have.been.calledWith({url: VERIFY_TESTER_URL2, qs: qs});
    });
  });
});
