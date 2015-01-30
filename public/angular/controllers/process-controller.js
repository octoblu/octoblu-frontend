'use strict';

angular.module('octobluApp')
.controller('ProcessController', function ($scope, $interval, ProcessNodeService) {

  $scope.sortProcesses = 'name';
  $scope.sortAscending = true;

  ProcessNodeService.getProcessNodes().then(function(processNodes){
    $scope.processNodes = processNodes;
  });

  $scope.stopProcess = function(processNodeUuid){
    ProcessNodeService.stopProcess(processNodeUuid);
  };

  $scope.startProcess = function(processNodeUuid){
    ProcessNodeService.startProcess(processNodeUuid);
  };

  $scope.getUptime = function(online, onlineSince){
    if(!online || !onlineSince){
      return null;
    }
    return moment(onlineSince).fromNow(true);
  };

  $scope.setSortProcess = function(sort){
    if ($scope.sortProcesses === sort) {
      $scope.sortAscending = !$scope.sortAscending;
      return;
    }
    $scope.sortProcesses = sort;
    $scope.sortAscending = true;

  };

  $scope.resetMessageCounter = function(){
    _.each($scope.processNodes, function(processNode){
      processNode.messagesReceivedOverTime = processNode.messagesReceivedOverTime || [];
      processNode.messagesReceivedOverTime.push(processNode.messagesReceived);
      processNode.messagesSentOverTime = processNode.messagesSentOverTime || [];
      if (processNode.messagesSentOverTime.length > 9) {
        processNode.messagesSentOverTime = processNode.messagesSentOverTime.slice(1);
      }
      if (processNode.messagesReceivedOverTime.length > 9) {
        processNode.messagesReceivedOverTime = processNode.messagesReceivedOverTime.slice(1);
      }
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
