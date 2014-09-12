var request    = require('request');
var when = require('when');
var SignupController = require('../../app/controllers/signup-controller');

describe('SignupController', function () {

  var sut, res;

  beforeEach(function () {

     sut = new SignupController();

     sut.prefinery = {
       getTester : sinon.spy()
     };

  });

  it('exists', function(){
    expect(sut).to.exist;
  });

  describe('signup without any data', function(){
    beforeEach(function () {
      var req = { body: {}};
      res = new FakeResponse();
      sut.signup(req, res);
    });

    it('should return a 401', function(){
      expect(res.send).to.have.been.calledWith(401);
    });

  });

  describe('signup with an email, password, invitationEmail, and invitationCode', function(){
    beforeEach(function () {
      var req = { body: { email: 'a@mailinator.com',
        password: 'b', invitationEmail: 'i@mailinator.com', invitationCode: 'c' }};
      res = new FakeResponse();
      sut.signup(req, res);
    });

    it('it should try to get the tester', function(){
      expect(sut.prefinery.getTester).to.have.been.called;
    });

      describe('prefinery tester', function(){

        beforeEach(function(){
          sut.prefinery.getTester = function() {
            return when.reject('user not found');
          }
        });

        it('should return a 401 if the tester does not exist', function(){

        });
      });
  });

});

var FakeResponse = function(){
  var response = this;

  this.send = sinon.spy();

  return response;
};