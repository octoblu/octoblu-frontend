'use strict';

angular.module('octobluApp')
.controller('ProcessController', function ($scope, $interval, ProcessNodeService) {

  $scope.sortProcesses = 'name';

  ProcessNodeService.getProcessNodes().then(function(processNodes){
    $scope.processNodes = processNodes;
  });

  $scope.stopProcess = function(processNode){
    ProcessNodeService.stopProcess(processNode);
  };

  $scope.startProcess = function(processNode){
    ProcessNodeService.startProcess(processNode);
  };

  $scope.getUptime = function(online, onlineSince){
    if(!online || !onlineSince){
      return null; 
    }
    return moment(onlineSince).fromNow(true);
  };

  $scope.resetMessageCounter = function(){
    _.each($scope.processNodes, function(processNode){
      processNode.messagesReceivedOverTime = processNode.messagesReceivedOverTime || [];
      processNode.messagesReceivedOverTime.push(processNode.messagesReceived);   
      processNode.messagesSentOverTime = processNode.messagesSentOverTime || [];
      processNode.messagesSentOverTime.push(processNode.messagesSent);   
      processNode.totalMessagesReceived = processNode.totalMessagesReceived || 0; 
      processNode.totalMessagesReceived += processNode.messagesReceived; 
      processNode.totalMessagesSent = processNode.totalMessagesSent || 0; 
      processNode.totalMessagesSent += processNode.messagesSent; 
      processNode.messagesReceived = 0; 
      processNode.messagesSent = 0; 
    }); 
  };

  $interval($scope.resetMessageCounter, 1000);

});
