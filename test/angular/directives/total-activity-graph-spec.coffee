describe 'totalActivityGraph', ->
  beforeEach ->
    module 'octobluApp'

  beforeEach ->
    module 'pages/total-activity-graph.html'

  beforeEach ->
    inject ($rootScope, $compile) =>
      element = '<total-activity-graph devices="devices"></total-activity-graph>'

      @scope = $rootScope.$new()
      @sut   = $compile element

  describe 'when called with no devices', ->
    beforeEach ->
      @scope.devices = []
      @element = @sut(@scope)
      @scope.$digest()

    it 'should go', ->
      expect(true).to.be.true



