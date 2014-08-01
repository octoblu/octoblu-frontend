var FlowDeployController = require('../../app/controllers/flow-deploy');
var _ = require('underscore');

describe('flowDeployController', function () {
  describe('create', function () {
    var sut, res;

    beforeEach(function () {
      sut = new FlowDeployController({flowDeploy: FakeFlowDeploy});
      res = new FakeResponse();
    });

    describe('an authorized request', function () {
      beforeEach(function () {
        var req = {user: {skynet: {uuid: 'some.uuid'}}};
        sut.create(req, res);
      });

      it('should return a 201', function() {
        expect(res.send.calledWith[0]).to.equal(201);
      });

      it('should call FlowDeploy.deploy with the user uuid', function () {
        expect(FakeFlowDeploy.deploy.calledWith[0]).to.equal('some.uuid');
      });
    });
  });
});

var FakeFlowDeploy = {
  deploy: function(){
    FakeFlowDeploy.deploy.calledWith = _.values(arguments);
  }
}

var FakeResponse = function(){
  var response = this;

  this.send = function(){
    response.send.calledWith = _.values(arguments);
  }

  return response;
};
