angular.module 'octobluApp'
  .service 'AnalyzeService', ($q, $http)=>
    class AnalyzeService
      getTopicSummary : =>
        return $http.get(OCTOBLU_API_URL + '/api/topics/summary').then (response) =>
          response.data

      getMessageSummary : =>
        return $http.get(OCTOBLU_API_URL + '/api/messages/summary').then (response) =>
          response.data

      getMessages : (query)=>
        return $http.get(OCTOBLU_API_URL + '/api/general/search',
          params:{
            q: query
          }).then (response) =>
            response.data

    return new AnalyzeService
