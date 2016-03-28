'use strict'
angular.module('octobluApp').controller 'ProcessGraphController', ($scope, $interval, ProcessNodeService, FlowService) ->

  $scope.sortProcesses = 'name'
  $scope.sortAscending = true
  $scope.totalMessagesReceivedOverTime = []
  $scope.totalMessagesSentOverTime = []
  $scope.loadingNodes = true


  ProcessNodeService.getProcessNodes().then (processNodes) ->
    $scope.loadingNodes = false
    $scope.processNodes = processNodes
    return

  $scope.resetMessageCounter = ->
    totalMessagesReceived = 0
    totalMessagesSent = 0
    _.each $scope.processNodes, (processNode) ->
      processNode.messagesReceivedOverTime = processNode.messagesReceivedOverTime or []
      processNode.messagesReceivedOverTime.push processNode.messagesReceived
      processNode.messagesSentOverTime = processNode.messagesSentOverTime or []
      if processNode.messagesSentOverTime.length > 9
        processNode.messagesSentOverTime = processNode.messagesSentOverTime.slice(1)
      if processNode.messagesReceivedOverTime.length > 9
        processNode.messagesReceivedOverTime = processNode.messagesReceivedOverTime.slice(1)
      processNode.messagesSentOverTime.push processNode.messagesSent
      processNode.totalMessagesReceived = processNode.totalMessagesReceived or 0
      processNode.totalMessagesReceived += processNode.messagesReceived
      processNode.totalMessagesSent = processNode.totalMessagesSent or 0
      processNode.totalMessagesSent += processNode.messagesSent
      totalMessagesReceived += processNode.messagesReceived
      totalMessagesSent += processNode.messagesSent
      processNode.messagesReceived = 0
      processNode.messagesSent = 0
      return
    $scope.totalMessagesReceivedOverTime.push totalMessagesReceived
    $scope.totalMessagesSentOverTime.push totalMessagesSent
    return

  $interval $scope.resetMessageCounter, 1000
  return
