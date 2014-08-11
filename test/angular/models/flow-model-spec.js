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
    beforeEach(function () {
      sut.addNode({ id: '1'});
      sut.addLink({ from: '2', to: '3' });
      sut.addLink({ from: '2', to: '1' , fromPort: '0', toPort: '1'});
      sut.addLink({ from: '1', to: '2' });
    });

    it('should add a link to the list of flow links', function () {
      expect(sut.getLinks().length).to.equal(3);
    });

    it('should return links for a specified node', function () {
      expect(sut.getLinksForNode('1').length).to.equal(2);
    });

    xit('should remove a specified link', function () {
      sut.removeLink({from: '2', fromPort: '0', to: '1', toPort: '1'});
      expect(sut.getLinks().length).to.equal(2);
    });

  });

});