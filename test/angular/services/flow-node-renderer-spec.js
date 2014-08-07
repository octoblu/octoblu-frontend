describe('FlowNodeRenderer', function () {
  var sut, renderScope;

  var nodeType = {
    width: 100,
    height: 40
  };

  beforeEach(function () {
    module('octobluApp');
    renderScope = d3.select('body').append('svg');
  });

  afterEach(function () {
    renderScope.remove();
  });

  describe('a node', function () {
    beforeEach(function () {
      inject(function (_FlowNodeRenderer_) {
        sut = _FlowNodeRenderer_;
      });
    });

    describe('findPortByCoordinate', function(){
      describe('when no match is found', function(){
        it('should not return a flownode', function(){
          var node = {x: 10, y: 10, inputLocations: [15] };
          expect(sut.findPortByCoordinate(1,1,[node])).to.be.undefined; 
        });
      });

      describe('when a match is found', function(){
        it('should return a match', function(){
          var match = {id: '1', port: 0};
          var node = {id: '1', x: 0, y: 0, inputLocations: [15] };
          expect(sut.findPortByCoordinate(16,16,[node])).to.deep.equal(match);
        });

        it('should return a match', function(){
          var match = {id: '1', port: 1};
          var node = {id: '1', x: 0, y: 0, inputLocations: [15,30] };
          expect(sut.findPortByCoordinate(31,31,[node])).to.deep.equal(match);
        });

        xit('should return a flowNode', function(){
          var node1, node2 
          node1 = {x : 0, y : 0}; 
          node2 = {x : 50, y : 50}; 
          var nodes = [node1, node2]; 
          expect(sut.findPortByCoordinate(51,51,nodes)).to.deep.equal(node2);
        });
      });
    });

    describe('pointInsideRectangle', function(){
      describe('when the point is inside the rectangle', function(){
        it('should return true', function(){
          expect(sut.pointInsideRectangle([1,1], [0,0,2,2])).to.be.true;
        });
      });

      describe('when the point is outside the rectangle on the left', function(){
        it('should return false', function(){
          expect(sut.pointInsideRectangle([0,1], [1,0,2,2])).to.be.false;
        });
      });

      describe('when the point is outside the rectangle on the right', function(){
        it('should return false', function(){
          expect(sut.pointInsideRectangle([3,1], [0,0,2,2])).to.be.false;
        });
      });

      describe('when the point is outside the rectangle on the top', function(){
        it('should return false', function(){
          expect(sut.pointInsideRectangle([1,0], [0,1,2,2])).to.be.false;
        });
      });

      describe('when the point is outside the rectangle on the bottom', function(){
        it('should return false', function(){
          expect(sut.pointInsideRectangle([1,3], [0,0,2,2])).to.be.false;
        });
      });
    });

    it('should render a node', function () {
      sut.render(renderScope, {id: '1'});
      expect(renderScope.selectAll('.flow-node').data().length).to.equal(1);
    });

    it('should render ports on nodes that have them', function () {
      sut.render(renderScope, {id: '1', input: 1});
      expect(renderScope.selectAll('.flow-node-port').data().length).to.equal(1);
    });

    it('should render two ports', function(){
      sut.render(renderScope, {id: '1', input: 1, output: 1});
      expect(renderScope.selectAll('.flow-node-port').data().length).to.equal(2);
    });

    it('should render an input port and an output port', function(){
      sut.render(renderScope, {id: '1', input: 1, output: 1});
      expect(renderScope.selectAll('.flow-node-input-port').data().length).to.equal(1);
      expect(renderScope.selectAll('.flow-node-output-port').data().length).to.equal(1);
    });

    it('should place the input port centered on the left', function(){
      sut.render(renderScope, {id: '1', input: 1});
      var port = renderScope.selectAll('.flow-node-input-port');
      expect(port.attr('x')).to.equal('-5');
      expect(port.attr('y')).to.equal(15 + '');
      expect(port.attr('width')).to.equal('10');
      expect(port.attr('height')).to.equal('10');
    });

    it('should place the output port on the right', function(){
      sut.render(renderScope, {id: '1', output: 1});
      var port = renderScope.selectAll('.flow-node-output-port');
      expect(port.attr('x')).to.equal((nodeType.width - 5) + '');
      expect(port.attr('y')).to.equal(((nodeType.height /2)- 5) + '');
      expect(port.attr('width')).to.equal('10');
      expect(port.attr('height')).to.equal('10');
    });

    it('should place 2 input ports evenly spaced on the left', function(){
      var node = {id: '1', input: 2};
      sut.render(renderScope, node);
      var ports = renderScope.selectAll('.flow-node-input-port')[0];

      expect(Math.round($(ports[0]).attr('y'))).to.equal(7);
      expect(Math.round($(ports[1]).attr('y'))).to.equal(23);
      expect(Math.round(node.inputLocations[0])).to.equal(7);
      expect(Math.round(node.inputLocations[1])).to.equal(23);
    });

    it('should place 3 input ports evenly spaced on the left', function(){
      var node = {id: '1', input: 3};
      sut.render(renderScope, node);
      var ports = renderScope.selectAll('.flow-node-input-port')[0];
      var nodeElement = $(renderScope.selectAll('.flow-node > rect')[0]);
      expect(nodeElement.attr('height')).to.equal('50');
      expect(Math.round($(ports[0]).attr('y'))).to.equal(5);
      expect(Math.round($(ports[1]).attr('y'))).to.equal(20);
      expect(Math.round($(ports[2]).attr('y'))).to.equal(35);
      expect(Math.round(node.inputLocations[0])).to.equal(5);
      expect(Math.round(node.inputLocations[1])).to.equal(20);
      expect(Math.round(node.inputLocations[2])).to.equal(35);

    });

    it('should place 3 output ports evenly spaced on the left', function(){
      var node = {id: '1', output: 3};
      sut.render(renderScope, node);
      var ports = renderScope.selectAll('.flow-node-output-port')[0];
      var nodeElement = $(renderScope.selectAll('.flow-node > rect')[0]);
      expect(nodeElement.attr('height')).to.equal('50');
      expect(Math.round($(ports[0]).attr('y'))).to.equal(5);
      expect(Math.round($(ports[1]).attr('y'))).to.equal(20);
      expect(Math.round($(ports[2]).attr('y'))).to.equal(35);
      expect(Math.round(node.outputLocations[0])).to.equal(5);
      expect(Math.round(node.outputLocations[1])).to.equal(20);
      expect(Math.round(node.outputLocations[2])).to.equal(35);

    });

    it('should place 4 input ports evenly spaced on the left', function(){
      sut.render(renderScope, {id: '1', input: 4});
      var node = $(renderScope.selectAll('.flow-node > rect')[0]);
      expect(node.attr('height')).to.equal('65');
    });

    it('should place 5 output ports evenly spaced on the left', function(){
      sut.render(renderScope, {id: '1', output: 5});
      var node = $(renderScope.selectAll('.flow-node > rect')[0]);
      expect(node.attr('height')).to.equal('80');
    });

  });
});
