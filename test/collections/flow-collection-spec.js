var when = require('when');
var octobluDB = require('../../app/lib/database');
var FlowCollection = require('../../app/collections/flow-collection');

describe('FlowCollection', function () {
  var sut, result, getUser, getFlowsByOwner, users, Flow;

  beforeEach(function () {
    octobluDB.createConnection();
    Flow = new FakeFlow();
    sut = new FlowCollection(Flow);
  });

  describe('fetch', function () {
    describe('when getFlows returns an empty array', function () {
      beforeEach(function () {
      });

      it('should call getFlows', function () {
        result = sut.fetch();
        expect(Flow.getFlows).to.have.been.called;
      });

      it('should return an array', function (done) {
        sut.fetch().then(function (flows) {
          expect(flows).to.be.instanceof(Array);
          done();
        })
        .catch(done);
      });

    });
  });
});

function FakeFlow() {
  this.getFlows = sinon.stub();
  this.getFlows.returns(when.resolve([]));
}
