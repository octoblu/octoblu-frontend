var NodeTypeController = require('../../app/controllers/node-type-controller');
var _ = require('underscore');

describe('NodeTypeController', function () {
  var sut, res;


  beforeEach(function () {
    sut = new NodeTypeController({NodeType: {} });
  });

  it('should instantiate', function () {
    expect(sut).to.exist;
  });

});
