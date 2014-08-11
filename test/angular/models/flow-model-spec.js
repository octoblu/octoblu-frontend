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
    expect(sut.nodes.length).to.equal(1);
  });

  describe('add links', function(){
    

    it('should exist', function(){
      expect(sut.addLink).to.exist;
    });
    
    it('should add a link to the list of flow links', function(){
      sut.addLink({});
      expect(sut.links.length).to.equal(1);
     });

  });

});