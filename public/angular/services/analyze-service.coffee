angular.module 'octobluApp'
  .service 'AnalyzeService', ($q, $http)=>
    class AnalyzeService
      getTopicSummary : =>
        return $http.get('/api/topics/summary').then (response) =>
          response.data

      getMessageSummary : =>
        return $q.when([
          {uuid: '4a5cdd8e-4dfd-466d-89b6-48515ef1464a', sent: 0, received: 999}
          {uuid: '60f6b2ff-c86d-47a3-896e-3aed68b14b9c', sent: 50, received: 50}
          {uuid: '76b014b2-13d9-4723-9651-ae4373e4643d', sent: 150, received: 0}
          {uuid: 'd7169665-b33b-46bd-b618-586453c2f70e', sent: 10, received: 100}
        ])

    return new AnalyzeService
