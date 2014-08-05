var _ = require('underscore');

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

  describe('when a Flow is saved with a node and a link', function () {
    beforeEach(function (done) {
      var sut = new Flow();
      sut.name = 'name 1';
      sut.resource.type = 'flow';
      sut.resource.owner.uuid = '1';
      sut.resource.owner.nodeType = 'user';
      sut.nodes = [{foo: 'bar'}];
      sut.links = [{first: 'second'}];
      sut.save(done);
    });

    it('should store the flow name', function (done) {
      Flow.findOne({}, function(err, flow){
        expect(err).to.be.null;
        expect(flow.name).to.deep.equal('name 1');
        done();
      });
    });

    it('should store the node', function (done) {
      Flow.findOne({}, function(err, flow){
        expect(err).to.be.null;
        expect(_.first(flow.nodes)).to.deep.equal({foo: 'bar'});
        done();
      });
    });

    it('should have links', function (done) {
      Flow.findOne({}, function(err, flow){
        expect(err).to.be.null;
        expect(_.first(flow.links)).to.deep.equal({first: 'second'});
        done();
      });
    });
  });

  describe('.updateOrCreateByFlowIdAndUser', function () {
    describe('when its called with flow id and user uuid', function () {
      beforeEach(function (done) {
        Flow.updateOrCreateByFlowIdAndUser('1', '2').then(function(){done()}, done);
      });

      it('should save a record in the database', function (done) {
        var query = {flowId: '1', 'resource.owner.uuid': '2', 'resource.owner.nodeType': 'user'};

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
        var query = {flowId: '6', 'resource.owner.uuid': '3', 'resource.owner.nodeType': 'user'};

        Flow.findOne(query, function(err, flow){
          expect(flow).to.exist;
          done();
        });
      });
    });

    describe('when its called with flowData', function () {
      beforeEach(function (done) {
        var flowData = {nodes: [{foo: 'bar'}]};

        Flow.updateOrCreateByFlowIdAndUser('6', '3', flowData).then(function(){done()}, done);
      });

      it('should store the flowData', function (done) {
        var query = {flowId: '6', 'resource.owner.uuid': '3', 'resource.owner.nodeType': 'user'};

        Flow.findOne(query, function(err, flow){
          expect(flow.nodes).include({foo: 'bar'});
          done();
        });
      });
    });

    describe('when there is already a flow', function () {
      beforeEach(function (done) {
        Flow.create({
          flowId: '2',
          resource: {
            type: 'flow',
            owner: {
              uuid: 'unique',
              type: 'user'
            }
          }
        }, done);
      });

      describe('and its called with the same id', function () {
        beforeEach(function (done) {
          Flow.updateOrCreateByFlowIdAndUser('2', 'unique', {name: 'Foo'})
          .then(function(){done()}, done);
        });

        it('should update the existing flow', function (done) {
          Flow.find({flowId: '2'}, function(err, flows){
            expect(_.size(flows)).to.equal(1);
            var flow = _.first(flows);
            expect(flow.name).to.equal('Foo');
            done();
          });
        });
      });
    });
  });
});
