describe 'CollectionBrowserController', ->
  beforeEach ->
    module 'octobluApp'

    inject ($controller, $rootScope) =>
      @scope = $rootScope.$new()
      @rootScope = $rootScope
      @sut = $controller 'CollectionBrowserController',
        $scope : @scope

  describe '->toggleActiveTab', ->
    beforeEach ->

    it 'should exist', ->
      expect(@sut.toggleActiveTab).to.exist

    describe 'when called with undefined or an empty string', ->
      beforeEach ->
        @sut.toggleActiveTab()
      it 'should not set the scope.tab.state', ->
        expect(@scope.tab).to.exist
        expect(@scope.tab.active).to.not.exist

    describe 'when called with flows', ->
      beforeEach ->
        @sut.toggleActiveTab('flows')
      it 'should set the scope.tab.state to flows', ->
        expect(@scope.tab.state).to.equal('flows')

    describe 'when called with debug', ->
      beforeEach ->
        @sut.toggleActiveTab('debug')
      it 'should set the scope.tab.state to debug', ->
        expect(@scope.tab.state).to.equal('debug')

    describe 'when called with nodes', ->
      beforeEach ->
        @sut.toggleActiveTab('nodes')
      it 'should set the scope.tab.state to nodes', ->
        expect(@scope.tab.state).to.equal('nodes')

    describe 'when called with any other value', ->
      beforeEach ->
        @sut.toggleActiveTab('wu-tang')
      it 'should set the scope.tab.state to undefined', ->
        expect(@scope.tab.state).to.not.exist
