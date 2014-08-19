var NodeRedTransformations = require('../../app/models/node-red-transformations');

describe('NodeRedTransformations', function () {
  var sut;
  it('be', function () {
    sut = new NodeRedTransformations();
  });

  describe('channel', function () {
    describe('when passed a channel without params', function () {
      it('should keep the type', function () {
        var result = sut.channel({type: 'channel'});
        expect(result.type).to.equal('channel');
      });
    });
  });
});
