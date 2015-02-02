angular.module 'octobluApp'
  .controller 'AnalyzeController', ($scope, AnalyzeService, GraphColors) =>
    PieColors = _.clone GraphColors
    AnalyzeService.getTopicSummary().then (topics)=>
      $scope.topicData = data: _.map _.sortBy(topics, 'value').reverse(), (data) =>
        return _.extend {value: data.value, label: data.topic}, PieColors.shift()
