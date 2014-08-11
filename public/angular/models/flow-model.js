'use strict';
angular.module('octobluApp')
  .constant('FlowModel', function () {
    var FlowModel = {
      nodes: [],
      links : [],
      addNode: function (flowNode) {
        FlowModel.nodes.push(flowNode);
      },
      addLink : function(flowLink){
        FlowModel.links.push(flowLink);

      }
    };
    console.log(FlowModel);
    return FlowModel;
  });

