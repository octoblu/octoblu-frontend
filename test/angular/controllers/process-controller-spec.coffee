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



 