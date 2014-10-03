
angular.module('octobluApp')
.constant('NO_PARAM_RULES',     ["true", "false", "null", "nnull", "else"])
.constant('SINGLE_PARAM_RULES', ["eq", "neq", "lt", "lte", "gt", "gte", "cont", "regex"])
.constant('DOUBLE_PARAM_RULES', ["btwn"])
.controller('switchRulesController', function($scope, NO_PARAM_RULES, SINGLE_PARAM_RULES, DOUBLE_PARAM_RULES) {
  'use strict';

  $scope.$watch('node.rules', function(newRules, oldRules) {
    var changedRules = _.difference(newRules, oldRules);

    $scope.node.output = _.size($scope.node.rules);
    _.each(changedRules, function(rule){
      if (_.contains(NO_PARAM_RULES, rule.t)) {
        delete rule.v;
        delete rule.v2;
        return;
      }

      if(_.contains(SINGLE_PARAM_RULES, rule.t)) {
        rule.v = rule.v || '';
        delete rule.v2;
        return;
      }

      if (_.contains(DOUBLE_PARAM_RULES, rule.t)) {
        rule.v  = rule.v  || '';
        rule.v2 = rule.v2 || '';
        return;
      }
    });
  }, true);

  $scope.addRule = function(){
    $scope.node.rules.push({t : 'eq', v :''});
  };

});
