angular.module('octobluApp')
.run(function(){
  if(window && window.ace && window.ace.config){
    window.ace.config.set('workerPath', '/lib/ace-builds/src-noconflict');
  }
});
