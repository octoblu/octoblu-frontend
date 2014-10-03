var request    = require('request');
var when = require('when');
var SignupController = require('../../app/controllers/signup-controller');
var mongoose = require('mongoose');

describe('SignupController', function () {
  var sut, res;

  before(function () {
    db = mongoose.createConnection();
    db.model('User', require('../../app/models/user'));
  });

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
      req = new FakeRequest({ body: { email: 'a@mailinator.com', password: 'b', testerId: '1', invitationCode: 'c' }});
      res = new FakeResponse();
    });

    describe('when an invitationEmail and invitationCode is provided', function(){
      beforeEach(function(){
        sut.verifyInvitationCode(req, res);
      });

      it('should call getTester with those values', function(){
        expect(sut.prefinery.getTester).to.have.been.calledWith({
          testerId: req.param('testerId'),
          invitationCode: req.param('invitationCode')
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

var FakeRequest = function(attributes){
  this.session = {};
  this.param = function(key){
    return attributes[key];
  }

  return this;
};

var FakeResponse = function(){
  this.send = sinon.spy();

  return this;
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
