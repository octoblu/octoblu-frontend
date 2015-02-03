angular.module 'octobluApp'
  .controller 'AnalyzeController', ($scope, AnalyzeService, GraphColors) =>

    TopicColors = _.clone GraphColors
    AnalyzeService.getTopicSummary().then (topics)=>
      $scope.topicData = _.map _.sortBy(topics, 'value').reverse(), (data) =>
        return _.extend {value: data.value, label: data.topic}, TopicColors.shift()

      $scope.topicData = {
        data: _.pluck $scope.topicData, 'value'
        labels: _.pluck $scope.topicData, 'label'
        colors: _.pluck $scope.topicData, 'color'
      }

    $scope.messageData = {
        series: ["Received", "Sent"]
    }

    AnalyzeService.getMessageSummary().then (messageSummary) =>
      messageSummary = _.sortBy messageSummary, (message) =>
        return -(message.received + message.sent)

      $scope.messageData.labels = _.map _.pluck(messageSummary, 'uuid'), (label) =>
        return label.slice(0,4) + "..." + label.slice(-4) if label.length > 8
        label

      $scope.messageData.data = [
        _.pluck messageSummary, 'received'
        _.pluck messageSummary, 'sent'
      ]

