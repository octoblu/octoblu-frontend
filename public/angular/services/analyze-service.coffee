angular.module 'octobluApp'
  .service 'AnalyzeService', ($q, $http)=>
    class AnalyzeService
      getTopicSummary : =>
        return $http.get('/api/topics/summary').then (response) =>
          response.data

      getMessageSummary : =>
        return $http.get('/api/messages/summary').then (response) =>
          response.data

    return new AnalyzeService
