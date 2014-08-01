module.exports = function() {
  this.getFlowNodeTypes = function(req, res) {
      //probably temporary.
      res.sendfile(process.cwd() + '/assets/json/flow-node-types.json');
  };

  return this;
};
