describe('switchRulesController', function () {
  var sut, scope;

  beforeEach(function () {
    module('octobluApp');

    inject(function($controller, $rootScope){
      scope = $rootScope.$new();
      scope.node = {rules: []};
      sut = $controller('switchRulesController', {$scope: scope});
    });
  });

  it('should instantiate', function () {
    expect(sut).to.exist;
  });

  describe('addRule', function () {
    beforeEach(function () {
      scope.addRule();
    });

    it('should insert a new rule into rules', function () {
      expect(_.first(scope.node.rules)).to.deep.equal({t: 'eq', v: ''});
    });
  });

  describe('changing rule type', function () {
    describe('when there is an else rule', function () {
      beforeEach(function () {
        scope.node.rules.push({t: 'else'});
        scope.$digest();
      });

      describe('when the rule type changes to eq', function () {
        beforeEach(function () {
          var rule = _.first(scope.node.rules);
          rule.t = 'eq';
          scope.$digest();
        });

        it('should remove the v key from the rule', function () {
          expect(_.first(scope.node.rules)).to.deep.equal({t: 'eq', v: ''});
        });
      });

      describe('when the rule type changes to btwn', function () {
        beforeEach(function () {
          var rule = _.first(scope.node.rules);
          rule.t = 'btwn';
          scope.$digest();
        });

        it('should remove the v key from the rule', function () {
          expect(_.first(scope.node.rules)).to.deep.equal({t: 'btwn', v: '', v2: ''});
        });
      });
    });

    describe('when there is an eq rule', function () {
      beforeEach(function () {
        scope.node.rules.push({t: 'eq', v: '1'});
        scope.$digest();
      });

      describe('when the rule type changes to otherwise', function () {
        beforeEach(function () {
          var rule = _.first(scope.node.rules);
          rule.t = 'else';
          scope.$digest();
        });

        it('should remove the v key from the rule', function () {
          expect(_.first(scope.node.rules)).to.deep.equal({t: 'else'});
        });
      });

      describe('when the rule type changes to between', function () {
        beforeEach(function () {
          var rule = _.first(scope.node.rules);
          rule.t = 'btwn';
          scope.$digest();
        });

        it('should add a v2 key to the rule', function () {
          expect(_.first(scope.node.rules)).to.deep.equal({t: 'btwn', v: '1', v2: ''});
        });
      });
    });

    describe('when there is a btwn rule', function () {
      beforeEach(function () {
        scope.node.rules.push({t: 'btwn', v: '2', v2: ''});
        scope.$digest();
      });

      describe('when the rule type changes to otherwise', function () {
        beforeEach(function () {
          var rule = _.first(scope.node.rules);
          rule.t = 'else';
          scope.$digest();
        });

        it('should remove the v and v2 keys from the rule', function () {
          expect(_.first(scope.node.rules)).to.deep.equal({t: 'else'});
        });
      });

      describe('when the rule type changes to equals', function () {
        beforeEach(function () {
          var rule = _.first(scope.node.rules);
          rule.t = 'eq';
          scope.$digest();
        });

        it('should remove the v2 key from the rule', function () {
          expect(_.first(scope.node.rules)).to.deep.equal({t: 'eq', v: '2'});
        });
      });

      describe('when the value 2 changes to 3', function () {
        beforeEach(function () {
          var rule = _.first(scope.node.rules);
          rule.v2 = '3';
          scope.$digest();
        });

        it('should not overwrite the v2 value', function () {
          expect(_.first(scope.node.rules)).to.deep.equal({t: 'btwn', v: '2', v2: '3'});
        });
      });
    });

    describe('when adding a new rule', function () {
      beforeEach(function () {
        scope.node.rules.push({});
        scope.$digest();
      });

      it('should create the correct amount of ports. ', function () {
        expect(scope.node.output).to.equal(1);
      });
    });

    describe('when adding a new rule after a rule exists', function () {
      beforeEach(function () {
        scope.node.rules.push({});
        scope.addRule({});
        scope.$digest();
      });

      it('should create the correct amount of ports. ', function () {
        expect(scope.node.output).to.equal(2);
      });
    });
  });
});
