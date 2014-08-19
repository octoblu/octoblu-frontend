var FlowDeployController = require('../../app/controllers/flow-deploy');
var _ = require('underscore');
var mongoose = require('mongoose');

describe('flowDeployController', function () {
  describe('create', function () {
    var sut, res, db, Flow, FakeFlowDeploy, fakeMeshblu;

    before(function (done) {
      db = mongoose.createConnection();
      Flow = db.model('Flow', require('../../app/models/flow'));
      db.open('localhost', 'octoblu_test', done);
    });

    beforeEach(function (done) {
      Flow.remove(done);
    });

    beforeEach(function () {
      FakeFlowDeploy = {
        deploy: function(){
          FakeFlowDeploy.deploy.calledWith = _.values(arguments);
        }
      }

      fakeMeshblu = new FakeMeshBlu();
    });

    beforeEach(function () {
      sut = new FlowDeployController({FlowDeploy: FakeFlowDeploy, mongoose: db, meshblu: fakeMeshblu});
      res = new FakeResponse();
    });

    describe('with a flow owned by the user', function () {
      beforeEach(function (done) {
        var flow = new Flow({
          flowId: 'fake',
          resource: {
            owner: {
              uuid: 'some.uuid'
            }
          }
        });
        flow.save(done);

        fakeGetFlows = function(uuid, callback){
          callback([{
            flowId: 'fake',
            resource: {
              owner: {
                uuid: 'some.uuid'
              }
            }
          }]);
        }
        sinon.stub(sut, 'getFlows', fakeGetFlows);
      });

      describe('an authorized request', function () {
        beforeEach(function () {
          var req = {user: {skynet: {uuid: 'some.uuid', token: 'some.hobit'}}};
          sut.create(req, res);
        });

        it('should return a 201', function() {
          expect(res.send.calledWith[0]).to.equal(201);
        });

        it('should call FlowDeploy.deploy with the user uuid and token', function () {
          expect(FakeFlowDeploy.deploy.calledWith[0]).to.equal('some.uuid');
          expect(FakeFlowDeploy.deploy.calledWith[1]).to.equal('some.hobit');
          expect(FakeFlowDeploy.deploy.calledWith[2]).to.deep.equal([{flowId: 'fake', resource: {owner: {uuid: 'some.uuid'}}}]);
          expect(FakeFlowDeploy.deploy.calledWith[3]).to.equal(fakeMeshblu);
        });
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
