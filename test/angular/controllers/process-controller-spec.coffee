describe 'ProcessController', ->
  beforeEach =>
    module 'octobluApp'

    inject ($controller, $rootScope, $q) =>
      @q = $q
      @scope = $rootScope.$new()
      @fakeProcessNodeService = new FakeProcessNodeService @q
      
      @sut = $controller('ProcessController', {
        $scope : @scope
        ProcessNodeService : @fakeProcessNodeService,
      })

  beforeEach ->

  it "should exist", =>
    expect(@sut).to.exist

    describe "getProcessNodes", =>
      it "should exist", =>
        expect(@scope.getProcessNodes).to.exist
      it "should call the ProcessNodeService.getProcessNodes", => 
        @scope.getProcessNodes()
        @scope.$digest()
        expect(@fakeProcessNodeService.getProcessNodes).to.have.been.called
      describe "when the user has no configured nodes available", =>
        beforeEach => 
          @fakeProcessNodeService.getProcessNodes.returns @q.when []
        it "should set processNodes to an empty array", =>
          @scope.getProcessNodes()
          @scope.$digest()
          expect(@scope.processNodes).to.deep.equal []
      describe "when the user does have configured nodes available", =>
        beforeEach => 
          @fakeProcessNodeService.getProcessNodes.returns @q.when [1,2,3]
        it "should set processNodes to a populated array", =>
          @scope.getProcessNodes()
          @scope.$digest()
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


  class FakeProcessNodeService
    constructor: (@q) ->
      @getProcessNodes = sinon.stub().returns @q.when()
      @stopProcess = sinon.stub().returns @q.when()
      @startProcess = sinon.stub().returns @q.when()

 