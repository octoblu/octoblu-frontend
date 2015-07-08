describe('FlowNodeRenderer', function () {
  var sut, renderScope, FlowNodeDimensions, skynetService, FlowLinkRenderer;

  var nodeType = {
    width: 80,
    height: 70
  };

  var context = {flow:{}};

  beforeEach(function () {
    module('octobluApp', function($provide){
      $provide.value('$cookies', {});
      $provide.value('reservedProperties', []);
      $provide.value('$intercom', {boot: sinon.stub()});
      $provide.value('$intercomProvider', {});
      $provide.constant('MESHBLU_HOST', '');
      $provide.constant('MESHBLU_PORT', '');
      $provide.constant('OCTOBLU_ICON_URL', 'https://ds78apnml6was.cloudfront.net/');
    });

    inject(function(_FlowLinkRenderer_) {
      FlowLinkRenderer = _FlowLinkRenderer_;
    });

    //renderScope = d3.select('body').append('svg');
    renderScope = new Snap();
    renderScope.group().addClass('flow-render-area')
      .group().addClass('flow-link-area');
    renderScope.attr({viewBox:"0 0 10000 10000"});
  });

  afterEach(function () {
    renderScope.selectAll("*").remove();
    context = {flow:{}};
  });

  describe('a node', function () {
    beforeEach(function () {
      inject(function (FlowNodeRenderer, _FlowNodeDimensions_) {
        sut = FlowNodeRenderer;
        FlowNodeDimensions = _FlowNodeDimensions_;
      });
    });

    describe('findInputPortByCoordinate', function(){
      describe('when no match is found', function(){
        it('should not return a flownode', function(){
          var node = {x: 10, y: 10, inputLocations: [15] };
          expect(sut.findInputPortByCoordinate(1,1,[node])).to.be.undefined;
        });
      });

      describe('when no match is found', function(){
        it('should not return a flownode', function(){
          var node = {x: 10, y: 10, inputLocations: [15] };
          expect(sut.findInputPortByCoordinate(1,1,[node])).to.be.undefined;
        });
      });

      describe('when a match is found', function(){
        it('should return a match', function(){
          var node = {id: '1', x: 0, y: 0, inputLocations: [15] };
          var match = {id: '1', port: 0};
          expect(sut.findInputPortByCoordinate(2,16,[node])).to.deep.equal(match);
        });

        it('should return the id of the node', function(){
          var node = {id: 't1000', x: 0, y: 0, inputLocations: [15] };
          var match = {id: 't1000', port: 0};
          expect(sut.findInputPortByCoordinate(2,16,[node])).to.deep.equal(match);
        });

        describe('when the x and y coordinates are in the first port', function () {
          it('should return a match', function(){
            var node = {id: '1', x: 0, y: 0, inputLocations: [15,30] };
            var match = {id: '1', port: 0};
            var port = sut.findInputPortByCoordinate(2,16,[node]);
            expect(port.port).to.equal(match.port)
            expect(port).to.deep.equal(match);
          });
        });

        describe('when the node is offset by 100 pixels to the right', function () {
          describe('when the x and y coordinates are in port 0', function () {
            var node;
            beforeEach(function () {
              node = {id: '1', x: 100, y: 0, inputLocations: [15,30] };
            });

            describe('when the x and y coordinates are in the first port', function () {
              it('should return a match', function(){
                var match = {id: '1', port: 0};
                var port = sut.findInputPortByCoordinate(102,16,[node]);
                expect(port.port).to.equal(match.port)
                expect(port).to.deep.equal(match);
              });
            });
          });

          describe('when the x and y coordinates in port 0, but just to the left of the node', function () {
            var node;
            beforeEach(function () {
              node = {id: '1', x: 100, y: 0, inputLocations: [15,30] };
            });

            describe('when the x and y coordinates are in the first port', function () {
              it('should return a match', function(){
                var match = {id: '1', port: 0};
                var port = sut.findInputPortByCoordinate(99,16,[node]);
                expect(port).to.deep.equal(match);
              });
            });
          });
        });

        describe('when the node is offset by 100 pixels to the down', function () {
          describe('when the x and y coordinates are in port 0', function () {
            var node;
            beforeEach(function () {
              node = {id: '1', x: 0, y: 100, inputLocations: [15,30] };
            });

            describe('when the x and y coordinates are in the first port', function () {
              it('should return a match', function(){
                var match = {id: '1', port: 0};
                var port = sut.findInputPortByCoordinate(2,116,[node]);

                expect(port.port).to.equal(match.port);
                expect(port).to.deep.equal(match);
              });
            });
          });
        });
      });
    });

    describe('findOutputPortByCoordinate', function(){
      describe('when no match is found', function(){
        it('should return undefined', function(){
          var node = {x: 0, y: 0, outputLocations: [15] };
          expect(sut.findOutputPortByCoordinate(1,1,[node])).to.be.undefined;
        });
      });

      describe('when no match is found', function(){
        it('should not return a flownode', function(){
          var node = {x: 0, y: 0, outputLocations: [15] };
          var port = sut.findOutputPortByCoordinate(FlowNodeDimensions.width, 3,[node])
          expect(port).to.be.undefined;
        });
      });

      describe('when a match is found', function(){
        it('should return a match', function(){
          var node = {id: '1', x: 0, y: 0, outputLocations: [15] };
          var match = {id: '1', port: 0};
          var port = sut.findOutputPortByCoordinate(FlowNodeDimensions.width + 2,16,[node]);
          expect(port).to.deep.equal(match);
        });

        it("should return the matching node's id", function(){
          var node = {id: 'john.connor', x: 0, y: 0, outputLocations: [15] };
          var match = {id: 'john.connor', port: 0};
          var port = sut.findOutputPortByCoordinate(FlowNodeDimensions.width + 2,16,[node]);
          expect(port).to.deep.equal(match);
        });

        describe('when the x and y coordinates are in the first port', function () {
          it('should return a match', function(){

            var node = {id: '1', x: 0, y: 0, outputLocations: [15,30] };
            var match = {id: '1', port: 0};
            var port = sut.findOutputPortByCoordinate(FlowNodeDimensions.width + 2, 16,[node]);
            expect(port.port).to.equal(match.port)
            expect(port).to.deep.equal(match);
          });
        });

        describe('when the node is offset by 100 pixels to the right', function () {
          describe('when the x and y coordinates are in port 0', function () {
            var node;
            beforeEach(function () {
              node = {id: '1', x: 100, y: 0, outputLocations: [15,30] };
            });

            describe('when the x and y coordinates are in the first port', function () {
              it('should return a match', function(){
                var match = {id: '1', port: 0};
                var port = sut.findOutputPortByCoordinate(FlowNodeDimensions.width + 102,16,[node]);
                expect(port.port).to.equal(match.port)
                expect(port).to.deep.equal(match);
              });
            });
          });
        });

        describe('when the node is offset by 100 pixels to the down', function () {
          describe('when the x and y coordinates are in port 0', function () {
            var node;
            beforeEach(function () {
              node = {id: '1', x: 0, y: 100, outputLocations: [15,30] };
            });

            describe('when the x and y coordinates are in the first port', function () {
              it('should return a match', function(){
                var match = {id: '1', port: 0};
                var port = sut.findOutputPortByCoordinate(FlowNodeDimensions.width + 2,116,[node]);

                expect(port.port).to.equal(match.port);
                expect(port).to.deep.equal(match);
              });
            });
          });
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
      sut.render(renderScope, {id: '1'}, context);
      expect(renderScope.selectAll('.flow-node').length).to.equal(1);
    });

    it('should render ports on nodes that have them', function () {
      sut.render(renderScope, {id: '1', input: 1}, context);
      expect(renderScope.selectAll('.flow-node-port').length).to.equal(1);
    });

    it('should render two ports', function(){
      sut.render(renderScope, {id: '1', input: 1, output: 1}, context);
      expect(renderScope.selectAll('.flow-node-port').length).to.equal(2);
    });

    it('should render an input port and an output port', function(){
      sut.render(renderScope, {id: '1', input: 1, output: 1}, context);
      expect(renderScope.selectAll('.flow-node-input-port').length).to.equal(1);
      expect(renderScope.selectAll('.flow-node-output-port').length).to.equal(1);
    });

    it('should place the input port centered on the left', function(){
      sut.render(renderScope, {id: '1', input: 1}, context);
      var port = renderScope.selectAll('.flow-node-input-port')[0];
      expect(port.attr('x')).to.equal('-7.5');
      expect(port.attr('y')).to.equal('27.5');
      expect(port.attr('width')).to.equal('15');
      expect(port.attr('height')).to.equal('15');
    });

    it('should place the output port on the right', function(){
      sut.render(renderScope, {id: '1', output: 1}, context);
      var port = renderScope.selectAll('.flow-node-output-port')[0];
      expect(port.attr('x')).to.equal((nodeType.width - 7.5) + '');
      expect(port.attr('y')).to.equal(((nodeType.height /2)- 7.5) + '');
      expect(port.attr('width')).to.equal('15');
      expect(port.attr('height')).to.equal('15');
    });
  });
});
