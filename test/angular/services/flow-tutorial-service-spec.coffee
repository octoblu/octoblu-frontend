xdescribe 'FlowTutorial', ->
  FlowTutorial = undefined

  beforeEach ->
    module 'octobluApp', ($provide) =>
      return

    inject (_$httpBackend_, _FlowTutorial_, $q, $rootScope) =>
      @httpBackend = _$httpBackend_
      @q = $q
      @rootScope = $rootScope
      _.defer => @rootScope.$digest()
      FlowTutorial = _FlowTutorial_

      @sut = new FlowTutorial {'something': {foo: 'bar'}, 'something else' : { baz: 'buzz' }}

  it 'should exist', ->
    expect(@sut).to.exist

  describe '->getStepName', ->
    beforeEach ->
      @weatherNode = id: 1, type: 'channel:weather'
      @configuredWeatherNode = _.extend {
          queryParams:
            city: 'Tempe'
        },
        @weatherNode

      @triggerNode = id: 2, type: 'operation:trigger'
      @emailNode = id: 3, type: 'channel:email'
      @configuredEmailNode = _.extend {
          bodyParams:
            to: 'me'
            subject: 'something pleasant'
            body: '{{msg.temperature}}'
        },
        @emailNode

    it 'should exist', ->
      expect(@sut.getStepName).to.exist

    describe 'when called with a flow with no nodes', ->
      beforeEach ->
        @stepNumber= @sut.getStepName({})

      it 'should return 0', ->
        expect(@stepNumber).to.equal 0

    describe 'when called with a flow with a weather node', ->
      beforeEach ->
        @stepNumber= @sut.getStepName({
            nodes: [ @weatherNode ]
          })

      it 'should return 1', ->
        expect(@stepNumber).to.equal 1

    describe 'when called with a flow with hamburgler node', ->
      beforeEach ->
        @stepNumber = @sut.getStepName({
            nodes: [ { type: 'channel:hamburgler' } ]
          })

      it 'should return 0', ->
        expect(@stepNumber).to.equal 0

    describe 'when called with a configured weather node', ->
      beforeEach ->
        @stepNumber = @sut.getStepName({
            nodes: [ @configuredWeatherNode ]
          })

      it 'should return 2', ->
        expect(@stepNumber).to.equal 2

    describe 'when called with a configured weather node and a trigger node', ->
      beforeEach ->
        @stepNumber = @sut.getStepName({
            nodes: [
              @configuredWeatherNode
              @triggerNode
            ]
          })

      it 'should return 3', ->
        expect(@stepNumber).to.equal 3

    describe 'when called with just a trigger node', ->
      beforeEach ->
        @stepNumber = @sut.getStepName({
            nodes: [
              @triggerNode
            ]
          })

      it 'should return 0', ->
        expect(@stepNumber).to.equal 0

    describe 'when connected channel node to trigger', ->
      beforeEach ->
        @stepNumber = @sut.getStepName({
            nodes: [
              @configuredWeatherNode
              @triggerNode
            ]
            links: [ { from: @triggerNode.id, to: @weatherNode.id } ]
          })

      it 'should return 4', ->
        expect(@stepNumber).to.equal 4

    describe 'when called with a configured weather node, a trigger node, and an email node', ->
      beforeEach ->
        @stepNumber = @sut.getStepName({
            nodes: [
              @configuredWeatherNode
              @triggerNode
              @emailNode
            ]
            links: [ { from: @triggerNode.id, to: @weatherNode.id } ]
          })

      it 'should return 5', ->
        expect(@stepNumber).to.equal 5

    describe 'when called with a configured weather node, a trigger node, and a configured email node (oh my)', ->
      beforeEach ->
        @stepNumber = @sut.getStepName({
            nodes: [
              @configuredWeatherNode
              @triggerNode
              @configuredEmailNode
            ]
            links: [ { from: @triggerNode.id, to: @weatherNode.id } ]
          })

      it 'should return 6', ->
        expect(@stepNumber).to.equal 6

    describe 'when called with a link from the weather node to the email node and all the other stuff', ->
      beforeEach ->
        @stepNumber = @sut.getStepName({
            nodes: [
              @configuredWeatherNode
              @triggerNode
              @configuredEmailNode
            ]
            links: [
              { from: @triggerNode.id, to: @weatherNode.id }
              { from: @weatherNode.id, to: @emailNode.id }
            ]
          })

      it 'should return 7', ->
        expect(@stepNumber).to.equal 7

    describe 'when everything is wired up, and deployed', ->
      beforeEach ->
        @stepNumber = @sut.getStepName({
            nodes: [
              @configuredWeatherNode
              @triggerNode
              @configuredEmailNode
            ]
            links: [
              { from: @triggerNode.id, to: @weatherNode.id }
              { from: @weatherNode.id, to: @emailNode.id }
            ]
            deployed: true
          })

      it 'should return 8', ->
        expect(@stepNumber).to.equal 8


    describe 'all of the above, plus the trigger was pushed', ->
      beforeEach ->
        @stepNumber = @sut.getStepName({
            nodes: [
              @configuredWeatherNode
              @triggerNode
              @configuredEmailNode
            ]
            links: [
              { from: @triggerNode.id, to: @weatherNode.id }
              { from: @weatherNode.id, to: @emailNode.id }
            ]
            deployed: true
            triggered: true
          })

      it 'should return 9', ->
        expect(@stepNumber).to.equal 9

  describe '->getStep', ->
    describe 'when called with a flow', ->
      beforeEach ->
        @flow = {}
        @sut.getStepName = sinon.spy()
        @sut.getStep(@flow).then (@result) =>

      it 'should call getStepName with that flow', ->
        expect(@sut.getStepName).to.have.been.calledWith @flow

    describe 'when getStepName returns "something"', ->
      beforeEach ->
        @sut.getStepName = sinon.stub().returns 'something'
        @sut.getStep({}).then (@result) =>

      it 'should return the step from the tutorial', ->
        expect(@result).to.deep.equal {foo: 'bar'}

    describe 'when getStepName returns "something else"', ->
      beforeEach ->
        @sut.getStepName = sinon.stub().returns 'something else'
        @sut.getStep({}).then (@result) =>

      it 'should return the step from the tutorial', ->
        expect(@result).to.deep.equal {baz: 'buzz'}

