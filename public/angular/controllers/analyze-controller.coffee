angular.module 'octobluApp'
  .controller 'AnalyzeController', ($scope, AnalyzeService, GraphColors, $interval) =>

    TopicColors = _.clone GraphColors
    $scope.messageData = {
        series: ["Received", "Sent"]
    }
    $scope.updatePeriodically = true

    $scope.stopUpdating = ->
      $scope.updatePeriodically = false

    $scope.startUpdating = ->
      $scope.updatePeriodically = true

    getTopicSummary = =>
      AnalyzeService.getTopicSummary().then (topics)=>
        $scope.topicData = _.map _.sortBy(topics, 'count').reverse(), (data) =>
          return _.extend {count: data.count, label: data.topic}, TopicColors.shift()

        $scope.topicData = {
          data: _.pluck $scope.topicData, 'count'
          labels: _.pluck $scope.topicData, 'label'
          colors: _.pluck $scope.topicData, 'color'
        }

    getMessageSummary = =>
      AnalyzeService.getMessageSummary().then (messageSummary) =>
        messageSummary = _.sortBy messageSummary, (message) =>
          return -(message.received + message.sent)

        $scope.messageData.labels = _.map _.pluck(messageSummary, 'uuid'), (label) =>
          return label.slice(0,4) + "..." + label.slice(-4) if label.length > 11
          label

        $scope.messageData.data = [
          _.pluck messageSummary, 'received'
          _.pluck messageSummary, 'sent'
        ]

    getTopicSummary()
    getMessageSummary()

    $interval =>
      return unless $scope.updatePeriodically?
      getTopicSummary()
      getMessageSummary()
    , 5000
