var Redport = function(options){
  var _this, config, request, userUUID, userToken;

  _this     = this;
  config    = options.config  || require('../../config/auth')[process.env.NODE_ENV];
  request   = options.request || require('request');
  userUUID  = options.userUUID;
  userToken = options.userToken;

  _this.designerManagerUrl = function(){
    return config.host + ':' + config.port + '/red/' + userUUID + '?token=' + userToken;
  };

  _this.redport = function(callback){
    request.put(_this.designerManagerUrl(), function(error, res, body){
      callback(null, body);
    });
  };
};

module.exports = Redport;
