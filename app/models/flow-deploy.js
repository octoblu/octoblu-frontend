var FlowDeploy = function(options){
  var _this = this;
  options         = options || {};

  _this.config    = options.config  || require('../../config/auth')[process.env.NODE_ENV];
  _this.request   = options.request || require('request');
  _this.userUUID  = options.userUUID;
  _this.userToken = options.userToken;


  _this.redport = function(callback){
    _this.request.put(_this.designerUrl(), function(error, res, body){
      callback(body);
    });
  };

  _this.designerUrl = function(){
    return _this.config.host + ':' + _this.config.port + '/red/' + _this.userUUID + '?token=' + _this.userToken;
  };
};

FlowDeploy.deploy = function(){

};

module.exports = FlowDeploy;
