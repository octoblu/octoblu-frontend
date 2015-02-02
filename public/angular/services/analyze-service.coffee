angular.module 'octobluApp'
  .service 'AnalyzeService', ($q)=>
    class AnalyzeService
      getTopicSummary : =>
        return $q.when([
            {topic: 'pulse', value: 100}
            {topic: 'flow-start', value: 25}
            {topic: 'flow-stop', value: 15}
            {topic: 'message', value: 50}
          ])

    return new AnalyzeService
