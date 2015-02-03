var _ = require('lodash');
var when = require('when');
var octobluDB = require('../../app/lib/database');
var FlowDeployController = require('../../app/controllers/flow-deploy');

describe('flowDeployController', function () {
  beforeEach(function(){
    octobluDB.createConnection();
  });

  describe('startInstance', function () {
    var sut, res, db, FakeFlow, FlowSchema, FakeFlowDeploy, fakeMeshblu;

    beforeEach(function () {
      FakeFlow = {
        getFlow: function(){},
        updateByFlowIdAndUser: function(){}
      };
      FakeFlowDeploy = {
        start: sinon.spy()
      };

      fakeMeshblu = new FakeMeshBlu();
    });

    beforeEach(function () {
      sut = new FlowDeployController({FlowDeploy: FakeFlowDeploy, meshblu: fakeMeshblu, Flow : FakeFlow });
      res = new FakeResponse();
    });

    describe('with a flow owned by the user', function () {
      var stub;
      beforeEach(function () {
        stub = sinon.stub(FakeFlow, 'getFlow', function(){
          return {
            then: function(resolve) {
              return resolve({flowId: 'fake', resource: {owner: {uuid: 'some.uuid'}}});
            }
          }
        });
      });

      afterEach(function(){
        FakeFlow.getFlow.restore();
      });

      describe('an authorized request', function () {
        beforeEach(function () {
          var req = {params: {id: 'fake'}, user: {skynet: {uuid: 'some.uuid', token: 'some.hobit'}}};
          sut.startInstance(req, res);
        });

        it('should return a 201', function() {
          expect(res.send.calledWith[0]).to.equal(201);
        });

        it('should call FlowDeploy.deploy with the user uuid and token', function () {
          expect(FakeFlowDeploy.start).to.be.calledWith(
            'some.uuid',
            {flowId: 'fake', resource: {owner: {uuid: 'some.uuid'}}},
            fakeMeshblu
          );
        });
      });
    });
  });

  var FakeMeshBlu = function(){
    return this;
  }

  var FakeResponse = function(){
    var response = this;

    this.send = function(){
      response.send.calledWith = _.values(arguments);
    }

    return response;
  };

});

