var _ = require('lodash');

describe('Flow', function () {
  var Flow, Meshblu;

  before(function(){
    Flow   = require('../../app/models/flow');
    Meshblu = new FakeMeshblu();
  });

  beforeEach(function (done) {
    Flow.remove(done);
  });

  describe('.createByUserUUID', function () {
    describe('when its called with flow id and user uuid', function () {
      var flowId;

      beforeEach(function (done) {
        Meshblu.register.responds = {uuid: '1'};
        Flow.createByUserUUID('2', {}, Meshblu).then(function(){done()}, done);
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
        Meshblu.register.responds = {uuid: '6'};
        Flow.createByUserUUID('3', {}, Meshblu).then(function(){done()}, done);
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
        Meshblu.register.responds = {uuid: '6'};

        Flow.createByUserUUID('3', flowData, Meshblu).then(function(){done()}, done);
      });

      it('should store the flowData', function (done) {
        var query = {flowId: '6', 'resource.owner.uuid': '3', 'resource.owner.nodeType': 'user'};

        Flow.findOne(query).then(function(flow){
          expect(flow.nodes).include({foo: 'bar'});
          done();
        });
      });
    });
  });

  describe('.updateByFlowIdAndUser', function () {
    describe('when there is a flow', function () {
      beforeEach(function (done) {
        Flow.insert({
          flowId: '2',
          resource: {
            type: 'flow',
            owner: {
              uuid: 'unique',
              type: 'user'
            }
          }
        }).then(function(){
          done()
        });
      });

      describe('and its called with the same id', function () {
        beforeEach(function (done) {
          Flow.updateByFlowIdAndUser('2', 'unique', {name: 'Foo'})
          .then(function(){done()}, done);
        });

        it('should update the existing flow', function (done) {
          Flow.find({flowId: '2'}).then(function(flows){
            expect(_.size(flows)).to.equal(1);
            var flow = _.first(flows);
            expect(flow.name).to.equal('Foo');
            done();
          });
        });
      });
    });

    describe('when there is not a flow', function () {
      describe('and update is called', function () {
        var updatePromise;

        beforeEach(function () {
          updatePromise = Flow.updateByFlowIdAndUser('2', 'unique', {name: 'Foo'});
        });

        it('should reject the promise', function (done) {
          updatePromise.then(function(){
            done('Promise was not rejected');
          }, function(){
            done();
          });
        });
      });
    });
  });
  describe('.deleteByFlowIdAndUser', function(){
    describe('when it is given a valid flowId and User', function () {
      beforeEach(function (done) {
        Flow.insert({
          flowId: '657',
          resource: {
            type: 'flow',
            owner: {
              uuid: 'unique-uuid',
              type: 'user'
            }
          }
        }).then(function(){done()});
      });

      it('should remove the record from the database', function (done) {
        var query = {flowId: '657', 'resource.owner.uuid': 'unique-uuid', 'resource.owner.nodeType': 'user'};
        Flow.findOne(query).then(function(flow){
          expect(flow).to.be.null;
          done();
        });
      });
    });
  });

  var FakeMeshblu = function() {
    var self = this;

    self.register = function(options, callback){
      _.defer(function() {
        callback(self.register.responds);
      });
    }

    return this;
  }
});
