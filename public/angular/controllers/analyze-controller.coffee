angular.module 'octobluApp'
  .controller 'AnalyzeController', ($scope, AnalyzeService, GraphColors, $interval) =>

    TopicColors = _.clone GraphColors
    $scope.messageData = {
        series: ["Received", "Sent"]
    }
    $scope.topicData = {}
    $scope.updatePeriodically = true
    $scope.loadingTopicData = true
    $scope.loadingMessageData = false

    $scope.stopUpdating = ->
      $scope.updatePeriodically = false

    $scope.startUpdating = ->
      $scope.updatePeriodically = true

    $scope.onClickPieSlice = (el) ->
      topic = _.first(el)?.label
      return unless topic?
      $scope.analyzeSearch = topic

    $scope.onClickBar = (el) ->
      label = _.first(el)?.label
      return unless label?
      uuid = $scope.barLabelMap[label]
      return unless uuid?

      $scope.analyzeSearch = uuid

    getTopicSummary = =>
      AnalyzeService.getTopicSummary().then (topics)=>
        $scope.loadingTopicData = false
        topicsSorted = _.sortBy(topics, 'count').reverse()
        topicsSorted.length = 7 if topicsSorted.length > 7

        topicData = _.map topicsSorted, (data) =>
          return _.extend {count: data.count, label: data.topic}, TopicColors.shift()

        $scope.topicData = {
          data: _.pluck topicData, 'count'
          labels: _.pluck topicData, 'label'
          colors: _.pluck topicData, 'color'
        }

    getMessageSummary = =>
      AnalyzeService.getMessageSummary().then (messageSummary) =>
        $scope.loadingMessageData = false
        $scope.barLabelMap = {}
        messageSummary = _.sortBy messageSummary, (message) =>
          return -(message.received + message.sent)
        messageSummary.length = 7 if messageSummary.length > 7

        $scope.messageData.labels = _.map messageSummary, (message) =>
          label = message.uuid
          label = label.slice(0,4) + "..." + label.slice(-4) if label.length > 11

          $scope.barLabelMap[label] = message.uuid

          label

        $scope.messageData.data = [
          _.pluck messageSummary, 'received'
          _.pluck messageSummary, 'sent'
        ]

    $scope.$watch "analyzeSearch", (newSearch) =>
      return if !newSearch || newSearch.trim().length <= 3
      AnalyzeService.getMessages(newSearch).then (results) =>
        $scope.searchResults = results

    getTopicSummary()
    getMessageSummary()

    intervalPromise = $interval =>
      return unless $scope.updatePeriodically?
      getTopicSummary()
      getMessageSummary()
    , 5000

    $scope.$on '$destroy', => $interval.cancel(intervalPromise)

