var _ = require('lodash');
var FlowDeployController = require('../../app/controllers/flow-deploy');
var mongoose = require('mongoose');

describe('flowDeployController', function () {

  describe('startInstance', function () {
    var sut, res, db, Flow, FlowSchema, FakeFlowDeploy, fakeMeshblu;

    before(function () {
      db = mongoose.createConnection();
      FlowSchema = db.model('Flow', require('../../app/models/flow'));
      Flow = db.model('Flow', FlowSchema);
    });

    beforeEach(function () {
      FakeFlowDeploy = {
        start: sinon.spy()
      }

      fakeMeshblu = new FakeMeshBlu();
    });

    beforeEach(function () {
      sut = new FlowDeployController({FlowDeploy: FakeFlowDeploy, mongoose: db, meshblu: fakeMeshblu});
      res = new FakeResponse();
    });

    describe('with a flow owned by the user', function () {
      var stub, fakeFindOne;
      beforeEach(function () {
        fakeFindOne = function(flow, callback) {
          callback({}, {flowId: 'fake', resource: {owner: {uuid: 'some.uuid'}}})
        };
        stub = sinon.stub(Flow, 'findOne', fakeFindOne);
      });

      afterEach(function(){
        Flow.findOne.restore();
      })

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

