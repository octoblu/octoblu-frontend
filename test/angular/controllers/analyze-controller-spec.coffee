describe 'AnalyzeController', ->
  beforeEach =>
    class FakeAnalyzeService
      constructor : (@q) ->
        @TopicSummaryDefer = @q.defer()
        @getTopicSummary = sinon.stub().returns @TopicSummaryDefer.promise

    module 'octobluApp'

    inject ($controller, $rootScope, $q, GraphColors) =>
      @q = $q
      @scope = $rootScope.$new()
      @rootScope = $rootScope
      @AnalyzeService = new FakeAnalyzeService @q
      @GraphColors = GraphColors
      @sut = $controller 'AnalyzeController',
        $scope : @scope,
        AnalyzeService : @AnalyzeService

  beforeEach ->

  it 'should exist', =>
    expect(@sut).to.exist

  describe 'when it is initialized', =>
    it 'should call AnalyzeService.getTopicSummary', =>
      expect(@AnalyzeService.getTopicSummary).to.have.been.called

  describe 'when getTopicSummary\'s promise resolves with no topics', =>
    beforeEach =>
      @AnalyzeService.TopicSummaryDefer.resolve {}
      @rootScope.$digest()

    it 'should assign an empty array to topicData', =>
      expect(@scope.topicData).to.deep.equal {data: []}

  describe 'when getTopicSummary\'s promise resolves with 1 topic', =>
    beforeEach =>
      @AnalyzeService.TopicSummaryDefer.resolve [ {topic: 'pulse', value:10} ]
      @rootScope.$digest()

    it 'should assign a non-empty array to topicData', =>
      expect(@scope.topicData).to.not.deep.equal {data: []}

    it 'should add color and highlight information to the topicData array', =>

      expect(@scope.topicData).to.deep.equal { data: [ _.extend({value: 10, label: "pulse"}, @GraphColors[0]) ]}

  describe 'when getTopicSummary\'s promise resolves with 1 different topic', =>
    beforeEach =>
      @AnalyzeService.TopicSummaryDefer.resolve [{ topic :'kittens', value :-1}]
      @rootScope.$digest()

    it 'should add color and highlight information to the topicData array', =>
      expect(@scope.topicData).to.deep.equal { data: [ _.extend(value: -1, label: "kittens", @GraphColors[0]) ]}

  describe 'when getTopicSummary\'s promise resolves with 2 topics', =>
    beforeEach =>
      @AnalyzeService.TopicSummaryDefer.resolve [{topic: 'kittens', value:-1}, {topic: 'mittens', value: 6}]
      @rootScope.$digest()

    it 'should add color and highlight information to the topicData array', =>
      expect(@scope.topicData).to.deep.equal { data: [
        _.extend({value: 6, label: "mittens" }, @GraphColors[0])
        _.extend({ value: -1, label: "kittens" }, @GraphColors[1])
      ]}
