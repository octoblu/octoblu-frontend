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

  describe('edit links and nodes', function () {
    beforeEach(function () {
      sut.addNode({ id: '1'});
      sut.addNode({ id: '2'});
      sut.addNode({ id: '3'});
      sut.addLink({ from: '2', to: '3' });
      sut.addLink({ from: '2', to: '1', fromPort: '0', toPort: '1'});
      sut.addLink({ from: '1', to: '2' });
    });

    it('should add a link to the list of flow links', function () {
      expect(sut.getLinks().length).to.equal(3);
    });

    it('should remove a specified link', function () {
      sut.removeLink({from: '2', fromPort: '0', to: '1', toPort: '1'});
      expect(sut.getLinks().length).to.equal(2);
    });

    it('should return links for a specified node', function () {
      expect(sut.getLinksForNode('1').length).to.equal(2);
    });

    it('should add a node to the list of flow nodes', function () {
      expect(sut.getNodes().length).to.equal(3);
    });

    it('should remove a specified node', function () {
      sut.removeNode('1');
      expect(sut.getNodes().length).to.equal(2);
    });

    it('should remove links associated with a node when it is removed', function () {
      sut.removeNode('1');
      expect(sut.getLinks().length).to.equal(1);
    });

  });
});