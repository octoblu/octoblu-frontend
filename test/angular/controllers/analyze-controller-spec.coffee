describe 'AnalyzeController', ->
  beforeEach =>
    class FakeAnalyzeService
      constructor : (@q) ->
        @TopicSummaryDefer = @q.defer()
        @getTopicSummary = sinon.stub().returns @TopicSummaryDefer.promise

        @MessageSummaryDefer = @q.defer()
        @getMessageSummary = sinon.stub().returns @MessageSummaryDefer.promise
        
        @MessagesDefer = @q.defer()  
        @getMessages = sinon.stub().returns @MessagesDefer.promise

    module 'octobluApp'

    inject ($controller, $rootScope, $q, GraphColors) =>
      @q = $q
      @fakeInterval = sinon.stub()
      @scope = $rootScope.$new()
      @rootScope = $rootScope
      @AnalyzeService = new FakeAnalyzeService @q
      @GraphColors = GraphColors
      @sut = $controller 'AnalyzeController',
        $scope : @scope,
        AnalyzeService : @AnalyzeService,
        $interval : @fakeInterval

  describe 'Topic Graph', =>
    it 'should call AnalyzeService.getTopicSummary', =>
      expect(@AnalyzeService.getTopicSummary).to.have.been.called

    describe 'when getTopicSummary\'s promise resolves with no topics', =>
      beforeEach =>
        @AnalyzeService.TopicSummaryDefer.resolve []
        @rootScope.$digest()

      it 'should assign an empty array to topicData', =>
        expect(@scope.topicData).to.deep.equal {data: [], labels: [], colors: []}

    describe 'when getTopicSummary\'s promise resolves with 1 topic', =>
      beforeEach =>
        @AnalyzeService.TopicSummaryDefer.resolve [ {topic: 'pulse', count:10} ]
        @rootScope.$digest()

      it 'should assign a non-empty array to topicData', =>
        expect(@scope.topicData).to.not.deep.equal {data: []}

      it 'should add color and highlight information to the topicData array', =>
        expect(@scope.topicData).to.deep.equal { data: [10], labels: ["pulse"], colors: [@GraphColors[0].color] }

    describe 'when getTopicSummary\'s promise resolves with 1 different topic', =>
      beforeEach =>
        @AnalyzeService.TopicSummaryDefer.resolve [{ topic :'kittens', count :-1}]
        @rootScope.$digest()

      it 'should add color and highlight information to the topicData array', =>
        expect(@scope.topicData).to.deep.equal { data: [ -1], labels: ["kittens"], colors: [@GraphColors[0].color] }

    describe 'when getTopicSummary\'s promise resolves with 2 topics', =>
      beforeEach =>
        @AnalyzeService.TopicSummaryDefer.resolve [{topic: 'kittens', count:-1}, {topic: 'mittens', count: 6}]
        @rootScope.$digest()

      it 'should add color and highlight information to the topicData array', =>
        expect(@scope.topicData).to.deep.equal {
          data: [ 6, -1]
          labels: [ "mittens", "kittens"]
          colors: [@GraphColors[0].color, @GraphColors[1].color]
        }

  describe 'Message Graph', =>
    it 'should call AnalyzeService.getMessageSummary', =>
      expect(@AnalyzeService.getMessageSummary).to.have.been.called

    describe 'when getMessageSummary\'s promise resolves with no messages', =>
      beforeEach =>
        @AnalyzeService.MessageSummaryDefer.resolve []
        @rootScope.$digest()
      it 'should assign an empty configuration object to messageData', =>
        expect(@scope.messageData).to.deep.equal {
          labels: []
          series: ["Received", "Sent"]
          data: [[], []]
        }

    describe 'when getMessageSummary\'s promise resolves with a devices', =>
      beforeEach =>
        @AnalyzeService.MessageSummaryDefer.resolve [{uuid:'9dc74eac-9007-4442-89f0-7ce276c7e978',sent:-1,received:9000}]
        @rootScope.$digest()
      it 'should assign a result configuration object to messageData', =>
        expect(@scope.messageData).to.deep.equal {
          labels: ['9dc7...e978']
          series: ["Received", "Sent"]
          data: [ [9000], [-1] ]
        }

    describe 'when getMessageSummary\'s promise resolves with 2 devices', =>
      beforeEach =>
        @AnalyzeService.MessageSummaryDefer.resolve [
          {
            uuid:'uuid123',
            sent:-1,
            received:9000
          },
          {
            uuid:'uuid456',
            sent: 4600,
            received:4600
          }
        ]
        @rootScope.$digest()

      it 'should assign a result configuration object to messageData', =>
        expect(@scope.messageData).to.deep.equal {
          labels: ['uuid456', 'uuid123']
          series: ["Received", "Sent"]
          data: [ [4600, 9000], [4600, -1] ]
        }

  describe 'update on interval', =>
    beforeEach =>
      @rootScope.$digest()

    it 'should call getTopicSummary with a delay', =>
      expect(@fakeInterval).to.have.been.called

    it 'should call getMessageSummary with a delay', =>
      expect(@fakeInterval).to.have.been.called.twice

  describe 'when search input is entered', =>
    beforeEach =>
      @scope.analyzeSearch = 'I entered some UUID'
      @rootScope.$digest()

    it 'should make a call to AnalyzeService.getMessages', =>
      expect(@AnalyzeService.getMessages).to.have.been.called

    it 'should make a call to AnalyzeService.getMessages with the search string', =>
      expect(@AnalyzeService.getMessages).to.have.been.calledWith 'I entered some UUID'

  describe 'when search input is undefined', =>
    beforeEach =>
      @scope.analyzeSearch = undefined
      @rootScope.$digest()
    it 'should not make a call to AnalyzeService.getMessages', =>
      expect(@AnalyzeService.getMessages).to.not.have.been.called

  describe 'when search input is null', =>
    beforeEach =>
      @scope.analyzeSearch = null
      @rootScope.$digest()
    it 'should not make a call to AnalyzeService.getMessages', =>
      expect(@AnalyzeService.getMessages).to.not.have.been.called

  describe 'when search input is empty', =>
    beforeEach =>
      @scope.analyzeSearch = ''
      @rootScope.$digest()
    it 'should not make a call to AnalyzeService.getMessages', =>
      expect(@AnalyzeService.getMessages).to.not.have.been.called 

  describe 'when AnalyzeService.getMessages returns no results', =>
    beforeEach =>
      @scope.analyzeSearch = 'uuid123'
      @AnalyzeService.MessagesDefer.resolve []
      @rootScope.$digest()

    it 'should set $scope.searchResults to an empty array', =>
      expect(@scope.searchResults).to.deep.equal([])

  describe 'when AnalyzeService.getMessages returns results', =>
    beforeEach =>
      @scope.analyzeSearch = 'uuid123'
      @AnalyzeService.MessagesDefer.resolve [1,2,3]
      @rootScope.$digest()

    it 'should set $scope.searchResults to the array', =>
      expect(@scope.searchResults).to.deep.equal([1,2,3])

