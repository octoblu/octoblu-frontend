angular.module 'octobluApp'
  .controller 'AnalyzeController', ($scope, AnalyzeService, GraphColors) =>

    TopicColors = _.clone GraphColors
    AnalyzeService.getTopicSummary().then (topics)=>
      $scope.topicData = _.map _.sortBy(topics, 'count').reverse(), (data) =>
        return _.extend {count: data.count, label: data.topic}, TopicColors.shift()

      $scope.topicData = {
        data: _.pluck $scope.topicData, 'count'
        labels: _.pluck $scope.topicData, 'label'
        colors: _.pluck $scope.topicData, 'color'
      }

    $scope.messageData = {
        series: ["Received", "Sent"]
    }

    AnalyzeService.getMessageSummary().then (messageSummary) =>
      messageSummary = _.sortBy messageSummary, (message) =>
        return -(message.received + message.sent)

      $scope.messageData.labels = _.pluck messageSummary, 'uuid'
      $scope.messageData.data = [
        _.pluck messageSummary, 'received'
        _.pluck messageSummary, 'sent'
      ]

