describe 'UtilityInspectorController', ->
  beforeEach ->
    module 'octobluApp', ($provide) =>
      $provide.value '$cookies', {}
      $provide.value '$intercom', sinon.stub()
      $provide.value '$intercomProvider', sinon.stub()
      $provide.value 'reservedProperties', ['$$hashKey', '_id']
      $provide.value 'OCTOBLU_ICON_URL', ''
      $provide.value('MESHBLU_HOST', 'http://whatever.com');
      $provide.value('MESHBLU_PORT', 1111)
      return

    inject ($controller, $rootScope) =>
      @scope = $rootScope.$new()
      @rootScope = $rootScope
      @sut = $controller 'UtilityInspectorController',
        $scope : @scope

  describe '->toggleActiveTab', ->
    beforeEach ->

    it 'should exist', ->
      expect(@sut.toggleActiveTab).to.exist

    it 'should default active tab to things on initialization', ->
      expect(@scope.tab.state).to.equal('things')

    describe 'when called with undefined or an empty string', ->
      beforeEach ->
        @sut.toggleActiveTab()
      it 'should not set the scope.tab.state', ->
        expect(@scope.tab).to.exist
        expect(@scope.tab.active).to.not.exist

    describe 'when called with tools', ->
      beforeEach ->
        @sut.toggleActiveTab('tools')
      it 'should set the scope.tab.state to tools', ->
        expect(@scope.tab.state).to.equal('tools')

    describe 'when called with debug', ->
      beforeEach ->
        @sut.toggleActiveTab('debug')
      it 'should set the scope.tab.state to debug', ->
        expect(@scope.tab.state).to.equal('debug')
      it 'should set scope.thingNameFilter to empty string', ->
        expect(@scope.thingNameFilter).to.equal('')

    describe 'when called with things', ->
      beforeEach ->
        @sut.toggleActiveTab('things')
      it 'should set the scope.tab.state to things', ->
        expect(@scope.tab.state).to.equal('things')

    describe 'when called with any other value', ->
      beforeEach ->
        @sut.toggleActiveTab('wu-tang')
      it 'should set the scope.tab.state to undefined', ->
        expect(@scope.tab.state).to.not.exist
