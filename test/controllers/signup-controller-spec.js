var request    = require('request');
var when = require('when');
var SignupController = require('../../app/controllers/signup-controller');

describe('SignupController', function () {

  var sut, res;

  beforeEach(function () {
     sut = new SignupController();
     sut.prefinery = new Prefinery();
  });

  it('exists', function(){
    expect(sut).to.exist;
  });

  describe('verifyInvitationCode with an email, password, testerId, and invitationCode', function(){
    var req;
    beforeEach(function () {
      req = { body: { email: 'a@mailinator.com', password: 'b', testerId: '1', invitationCode: 'c' }};
      res = new FakeResponse();
    });

    describe('when an invitationEmail and invitationCode is provided', function(){
      beforeEach(function(){
        sut.verifyInvitationCode(req, res);
      });

      it('should call getTester with those values', function(){
        expect(sut.prefinery.getTester).to.have.been.calledWith({
          testerId: req.body.testerId,
          invitationCode: req.body.invitationCode
        });
      });
    });

    describe('prefinery tester', function(){
      describe('when the tester does not exist', function () {
        beforeEach(function(done){
          sut.verifyInvitationCode(req, res);
          sut.prefinery.getTester.reject('user not found');
          sut.prefinery.getTester.promise.finally(done);
        });

        it('should return a 422', function(){
          expect(res.send).to.have.been.calledWith(422);
        });
      });
    });
  });

});

var FakeResponse = function(){
  var response = this;

  this.send = sinon.spy();

  return response;
};

var Prefinery = function() {
  var prefinery =  {
    getTester : function(){
      var defer = when.defer();

      prefinery.getTester.resolve = defer.resolve;
      prefinery.getTester.reject  = defer.reject;
      prefinery.getTester.finally = defer.promise.finally;
      prefinery.getTester.promise = defer.promise;

      return defer.promise;
    }
  };
  prefinery.getTester = sinon.spy(prefinery.getTester);
  return prefinery;
}
