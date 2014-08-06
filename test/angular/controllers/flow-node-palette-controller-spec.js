describe('FlowNodePaletteController', function () {
  var sut, scope;

  beforeEach(function () {
    module('octobluApp');

    inject(function($rootScope, $controller){
      scope = $rootScope.$new();
      scope.flowNodeTypes = [];
      sut   = $controller('FlowNodePaletteController', {$scope: scope});
    });
  });

  it('should instantiate', function () {
    expect(sut).to.exist;
  });

  describe('grouping flowNodeTypes', function () {
    describe('when a flowNodeType gets added to the scope', function () {
      var flowNodeType = {category: 'foo', key: 'value'};

      beforeEach(function () {
        scope.flowNodeTypes.push(flowNodeType);
        scope.$digest();
      });

      it('should group the flowNodeType', function () {
        expect(scope.typesByCategory.foo).to.include(flowNodeType);
      });
    });

    describe('when a flowNodeType gets added to the scope', function () {
      var flowNodeType = {category: 'foo', key: 'stuff'};

      beforeEach(function () {
        scope.flowNodeTypes.push(flowNodeType);
        scope.$digest();
      });

      it('should group the flowNodeType', function () {
        expect(scope.typesByCategory.foo).to.include(flowNodeType);
      });
    });

    describe('when two flowNodeTypes get added to the scope', function () {
      var flowNodeType1, flowNodeType2;
      flowNodeType1 = {category: 'foo', key: 'stuff'};
      flowNodeType2 = {category: 'bar', key: 'value'};

      beforeEach(function () {
        scope.flowNodeTypes.push(flowNodeType1);
        scope.flowNodeTypes.push(flowNodeType2);
        scope.$digest();
      });

      it('should group flowNodeType1 under foo', function () {
        expect(scope.typesByCategory.foo).to.include(flowNodeType1);
      });

      it('should group flowNodeType2 under bar', function () {
        expect(scope.typesByCategory.bar).to.include(flowNodeType2);
      });
    });
  });
});

var FakeEvent = function(){
  var _this = this;

  _this.dataTransfer = {
    setData: sinon.spy()
  };

  return _this;
};
