describe('BillOfMaterialsService', function () {
  var sut, fakeNodeTypeService;
  beforeEach(function () {
    module('octobluApp');

    module('octobluApp', function($provide){
      fakeNodeTypeService = new FakeNodeTypeService();
      $provide.value('NodeTypeService', fakeNodeTypeService);
    });

    inject(function(BillOfMaterialsService){
      sut = BillOfMaterialsService;
    });

  });

  it('should exist', function(){
    expect(sut).to.exist;
  })

  describe("generate", function() {
    describe("when given an empty flow", function() {
      it("should return an empty array", function() {
        var bill;
        bill = sut.generate({});
        expect(bill).to.deep.equal([]);
      });
    });

    describe("when it has a flow with one node", function() {
      var result;
      beforeEach(function(){
        result = sut.generate({
          nodes: [{}]
        });
      });

      it("return a single thing", function() {
        expect(_.size(result)).to.equal(1);
      });
    });

    describe("when it has a flow with one operator node", function() {
      var result;
      beforeEach(function(){
        result = sut.generate({
          nodes: [{ type: 'operation:trigger' }]
        });
      });

      it("return an empty array", function() {
        expect(_.size(result)).to.equal(0);
      });
    });

    describe("when it has a flow with another operator node", function() {
      var result;
      beforeEach(function(){
        result = sut.generate({
          nodes: [{ type: 'operation:equal' }]
        });
      });

      it("return an empty array", function() {
        expect(_.size(result)).to.equal(0);
      });
    });

    describe("when it has a flow an owl", function() {
      var result;
      beforeEach(function(){
        result = sut.generate({
          nodes: [{}, {}]
        });
      });

      it("return a unique set of nodes", function() {
        expect(_.size(result)).to.equal(1);
      });
    });

    describe("when it has a flow with 2 different types", function() {
      var result;
      beforeEach(function(){
        result = sut.generate({
          nodes: [{ type: 'channel:twitter'}, { type: 'device:blink1' }]
        });
      });

      it("return a unique set of nodes by type", function() {
        expect(_.size(result)).to.equal(2);
      });
    });

    describe("when the flow has a bunch of other stuff in it", function() {
      var result;
      beforeEach(function(){
        result = sut.generate({
          nodes: [{ type: 'channel:twitter', name: 'something'}]
        });
      });

      it("should remove the other stuffs", function() {
        expect(_.first(result)).to.deep.equal({type: 'channel:twitter', logo: 'twitter.svg'});
      });
      
    });
  });
  
  var FakeNodeTypeService = function() {
    this.addLogo = function(node) {
      node.logo = 'twitter.svg';
      return node;
    };
  };

});
