describe('Flow', function () {
  var Flow;

  before(function(done){
    var mongoose   = require('mongoose');
    var FlowSchema = require('../../app/models/flow');
    var db = mongoose.createConnection();
    Flow   = db.model('Flow', FlowSchema);
    db.open('localhost', 'octoblu_test', done);
  });

  beforeEach(function (done) {
    Flow.remove(done);
  });

  it('should instantiate', function () {
    expect(new Flow()).to.exist;
  });

  describe('.updateOrCreateByFlowIdAndUser', function () {
    it('should be a function', function () {
      Flow.updateOrCreateByFlowIdAndUser();
    });

    describe('when its called with flow id and user uuid', function () {
      beforeEach(function (done) {
        Flow.updateOrCreateByFlowIdAndUser('1', '2').then(function(){done()}, done);
      });

      it('should save a record in the database', function (done) {
        var query = {flowId: '1', 'resource.owner.uuid': '2', 'resource.owner.type': 'user'};

        Flow.findOne(query, function(err, flow){
          expect(err).to.be.null;
          expect(flow).to.exist;
          done();
        });
      });
    });

    describe('when its called with a different flow id and user uuid', function () {
      beforeEach(function (done) {
        Flow.updateOrCreateByFlowIdAndUser('6', '3').then(function(){done()}, done);
      });

      it('should save a record in the database', function (done) {
        var query = {flowId: '6', 'resource.owner.uuid': '3', 'resource.owner.type': 'user'};

        Flow.findOne(query, function(err, flow){
          expect(flow).to.exist;
          done();
        });
      });
    });
  });
});
