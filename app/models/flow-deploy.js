var FlowDeploy = function(options){
  var _this = this;
  options = options || {};

  _this.config   = options.config  || require('../../config/auth')[process.env.NODE_ENV];
  _this.request  = options.request || require('request');
  _this.userUUID = options.userUUID;

  _this.redport = function(){
    _this.request.put(_this.designerUrl());
  };

  _this.designerUrl = function(){
    return _this.config.host + ':' + _this.config.port + '/red/' + _this.userUUID + '?asdf' ;
  };
};

FlowDeploy.deploy = function(){

};

module.exports = FlowDeploy;
