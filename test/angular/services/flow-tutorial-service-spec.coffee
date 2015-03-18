describe 'FlowTutorialService', =>
  beforeEach ->
    module 'octobluApp', ($provide) =>
      return

    inject (_$httpBackend_, FlowTutorialService) =>
      @httpBackend = _$httpBackend_

      @sut = FlowTutorialService

  it 'should exist', ->    
    expect(@sut).to.exist
  
  describe '->getStepNumber', ->
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
      expect(@sut.getStepNumber).to.exist

    describe 'when called with a flow with no nodes', ->
      beforeEach ->
        @stepNumber= @sut.getStepNumber({})

      it 'should return 0', ->
        expect(@stepNumber).to.equal 0

    describe 'when called with a flow with a weather node', ->
      beforeEach ->
        @stepNumber= @sut.getStepNumber({
            nodes: [ @weatherNode ]
          })

      it 'should return 1', ->
        expect(@stepNumber).to.equal 1

    describe 'when called with a flow with hamburgler node', ->
      beforeEach ->
        @stepNumber = @sut.getStepNumber({
            nodes: [ { type: 'channel:hamburgler' } ]
          })

      it 'should return 0', ->
        expect(@stepNumber).to.equal 0

    describe 'when called with a configured weather node', ->
      beforeEach ->
        @stepNumber = @sut.getStepNumber({
            nodes: [ @configuredWeatherNode ]
          })

      it 'should return 2', ->
        expect(@stepNumber).to.equal 2

    describe 'when called with a configured weather node and a trigger node', ->
      beforeEach ->
        @stepNumber = @sut.getStepNumber({
            nodes: [ 
              @configuredWeatherNode
              @triggerNode            
            ]
          })

      it 'should return 3', ->
        expect(@stepNumber).to.equal 3

    describe 'when called with just a trigger node', ->
      beforeEach ->
        @stepNumber = @sut.getStepNumber({
            nodes: [ 
              @triggerNode            
            ]
          })

      it 'should return 0', ->
        expect(@stepNumber).to.equal 0

    describe 'when connected channel node to trigger', ->
      beforeEach ->
        @stepNumber = @sut.getStepNumber({
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
        @stepNumber = @sut.getStepNumber({
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
        @stepNumber = @sut.getStepNumber({
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
        @stepNumber = @sut.getStepNumber({
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
        @stepNumber = @sut.getStepNumber({            
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

      it 'should return 7', ->
        expect(@stepNumber).to.equal 8      