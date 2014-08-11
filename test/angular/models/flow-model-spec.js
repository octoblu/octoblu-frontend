describe('FlowModel', function () {
  var sut;

  beforeEach(function () {
    module('octobluApp');

    module('octobluApp', function () {
    });

    inject(function (FlowModel) {
      sut = FlowModel();
    });
  });

  it('should exist', function () {
    expect(sut).to.exist;
  });

  it('should add a node to the list of flowNodes', function () {
    sut.addNode({});
    expect(sut.getNodes().length).to.equal(1);
  });

  describe('add links', function () {


    it('should exist', function () {
      expect(sut.addLink).to.exist;
    });

    it('should add a link to the list of flow links', function () {
      sut.addLink({});
      expect(sut.getLinks().length).to.equal(1);
    });

    it('should return links for a specified node', function () {
      sut.addNode({ id: '1'});
      sut.addLink({ from: '1', to: '1' });
      sut.addLink({ from: '2', to: '2' });
      expect(sut.getLinks({forNode: '1'}).length).to.equal(1);
    });

  });

});