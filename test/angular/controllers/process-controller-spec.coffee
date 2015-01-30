describe 'ProcessController', ->
  beforeEach =>
    class FakeProcessNodeService
      constructor: (@q) ->
        @processNodesDefer = @q.defer()
        @getProcessNodes = sinon.stub().returns @processNodesDefer.promise
        @stopProcess = sinon.stub().returns @q.when()
        @startProcess = sinon.stub().returns @q.when()

    module 'octobluApp'

    inject ($controller, $rootScope, $q) =>
      @q = $q
      @scope = $rootScope.$new()
      @fakeProcessNodeService = new FakeProcessNodeService @q
      
      @sut = $controller('ProcessController', {
        $scope : @scope
        ProcessNodeService : @fakeProcessNodeService,
      })

  describe "when the user has no configured nodes available", =>
    beforeEach =>
      @fakeProcessNodeService.processNodesDefer.resolve []
      @scope.$digest()

    it "should set processNodes to an empty array", =>
      expect(@scope.processNodes).to.deep.equal []

  describe "when the user does have configured nodes available", =>
    beforeEach => 
      @fakeProcessNodeService.processNodesDefer.resolve [1,2,3]
      @scope.$digest()

    it "should set processNodes to a populated array", =>
      expect(@scope.processNodes).to.deep.equal [1,2,3]

  describe "stopProcess", => 
    it "should exist", => 
      expect(@scope.stopProcess).to.exist
    it "should call ProcessNodeService.stopProcess", =>
      @scope.stopProcess()
      @scope.$digest()
      expect(@fakeProcessNodeService.stopProcess).to.have.been.called

    it "should call ProcessNodeService.stopProcess with a process node", =>
      fakeProcessNode = {uuid : "12345", token: "45678"}
      @scope.stopProcess(fakeProcessNode)
      @scope.$digest()
      expect(@fakeProcessNodeService.stopProcess).to.have.been.calledWith(fakeProcessNode)

  describe "startProcess", => 
    it "should exist", => 
      expect(@scope.startProcess).to.exist
    it "should call ProcessNodeService.startProcess", =>
      @scope.startProcess()
      @scope.$digest()
      expect(@fakeProcessNodeService.startProcess).to.have.been.called

    it "should call ProcessNodeService.startProcess with a process node", =>
      fakeProcessNode = {uuid : "12345", token: "45678"}
      @scope.startProcess(fakeProcessNode)
      @scope.$digest()
      expect(@fakeProcessNodeService.startProcess).to.have.been.calledWith(fakeProcessNode)

  describe 'resetMessageCounter', =>
    describe 'updating', =>
      beforeEach => 
        @device = {messagesReceived: 123, messagesSent: 123, totalMessagesReceived: 7, totalMessagesSent: 8, messagesSentOverTime: [0], messagesReceivedOverTime : [0]}
        @fakeProcessNodeService.processNodesDefer.resolve [@device]
        @scope.$digest()
        @scope.resetMessageCounter()

      it 'should set messagesReceived to zero', =>
        expect(@device.messagesReceived).to.equal 0

      it 'should set totalMessagesReceived to messagesReceived', =>
        expect(@device.totalMessagesReceived).to.equal 130
      
      it 'should append messagesReceived to messagesReceivedOverTime', =>
        expect(@device.messagesReceivedOverTime).to.deep.equal [0,123]

      it 'should set messagesSent to zero', =>
        expect(@device.messagesSent).to.equal 0

      it 'should set totalMessagesSent to messagesSent', =>
        expect(@device.totalMessagesSent).to.equal 131

      it 'should append messagesSent to messagesSentOverTime', =>
        expect(@device.messagesSentOverTime).to.deep.equal [0,123]

    describe 'when messagesSentOverTime and messagesReceivedOverTime is full', =>
      beforeEach => 
        @device = {messagesReceived: 21, messagesSent: 21, totalMessagesReceived: 7, totalMessagesSent: 8, messagesSentOverTime: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], messagesReceivedOverTime : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]}
        @fakeProcessNodeService.processNodesDefer.resolve [@device]
        @scope.$digest()
        @scope.resetMessageCounter()

      it 'should limit size of messagesSentOverTime to 20', =>
        expect(@device.messagesSentOverTime).to.deep.equal [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]

      it 'should limit size of messagesReceivedOverTime to 20', =>
        expect(@device.messagesReceivedOverTime).to.deep.equal [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]

  describe 'getUptime', =>
    it 'should return null if not online', =>
      expect(@scope.getUptime(false)).to.equal null

    it 'should return null if online and onlineSince is undefined', => 
      expect(@scope.getUptime(true, undefined)).to.equal null
 
    it 'should return a string if online and onlineSince is defined', => 
      expect(@scope.getUptime(true, new Date())).not.to.equal null

  describe 'setSortProcess', =>
    describe 'by default', =>
      it "should set sortProcesses to name", =>
        expect(@scope.sortProcesses).to.equal 'name'

      it "should set sortAscending to true", =>
        expect(@scope.sortAscending).to.be.true

    describe 'when called for the first time', =>
      beforeEach =>
        @scope.setSortProcess 'Foo'

      it "should set sortProcess on the scope", =>
        expect(@scope.sortProcesses).to.equal 'Foo'

    describe 'when called with the same name twice', =>
      beforeEach =>
        @scope.setSortProcess 'Foo'
        @scope.setSortProcess 'Foo'

      it "should set sortAscending to false", =>
        expect(@scope.sortAscending).to.be.false

    describe 'when called with the same name thrice', =>
      beforeEach =>
        @scope.setSortProcess 'Foo'
        @scope.setSortProcess 'Foo'
        @scope.setSortProcess 'Foo'

      it "should set sortAscending to true", =>
        expect(@scope.sortAscending).to.be.true

    describe 'when called with a different name', =>
      beforeEach =>
        @scope.setSortProcess 'Foo'
        @scope.setSortProcess 'Bar'

      it "should set sortAscending to true", =>
        expect(@scope.sortAscending).to.be.true

