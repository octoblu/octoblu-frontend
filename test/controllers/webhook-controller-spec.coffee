WebhookController = require '../../app/controllers/webhook-controller'
When = require 'when'

describe 'WebhookController', ->
  describe '->constructor', ->
    beforeEach ->
      @sut = new WebhookController meshblu : {}, Flow: {}

    it 'should exist', ->
      expect(@sut).to.exist

  describe '->trigger', ->
    beforeEach ->
      @meshblu = 
        message : sinon.spy()
      @Flow =
        findOne: sinon.spy()
      @options = 
        meshblu : @meshblu
        Flow : @Flow
      @sut = new WebhookController @options

    describe 'when called a correct request and response', ->
      beforeEach ->
        @Flow.findOne = sinon.stub().returns When.resolve(flowId: 'super-flow')
        request = 
          params: 
            id: 'super-trigger'
          body:
            name: 'triggering it for realz'
        @response = {}
        @response.status = sinon.stub().returns @response
        @response.end = sinon.spy()
        @sut.trigger(request, @response)      

      it 'should call Flow.findOne with nodes.id query', ->
        expect(@Flow.findOne).to.have.been.calledWith {'nodes.id': 'super-trigger'}
    
      it 'should call meshblu.message with the correctly crafted message', -> 
        message =
          devices: ['super-flow']
          topic: 'webhook'
          payload:
            from: 'super-trigger'
            params:
              name: 'triggering it for realz'

        expect(@meshblu.message).to.have.been.calledWith message 

      it 'should call response.status(201) and response.end()', ->
        expect(@response.status).to.have.been.calledWith 201
        expect(@response.end).to.have.been.called

    describe 'when called a different request and response', ->
      beforeEach ->
        @Flow.findOne = sinon.stub().returns When.resolve(flowId: 'cheeseburger-flow')
        request = 
          params: 
            id: 'cheeseburger-trigger'
          body:
            name: 'triggering it for not so realz'
        @response = {}
        @response.status = sinon.stub().returns @response
        @response.end = sinon.spy()
        @sut.trigger(request, @response)      

      it 'should call Flow.findOne with nodes.id query', ->
        expect(@Flow.findOne).to.have.been.calledWith {'nodes.id': 'cheeseburger-trigger'}
    
      it 'should call meshblu.message with the correctly crafted message', -> 
        message =
          devices: ['cheeseburger-flow']
          topic: 'webhook'
          payload:
            from: 'cheeseburger-trigger'
            params:
              name: 'triggering it for not so realz'

        expect(@meshblu.message).to.have.been.calledWith message 

      it 'should call response.status(201) and response.end()', ->
        expect(@response.status).to.have.been.calledWith 201
        expect(@response.end).to.have.been.called

    describe 'when called a non-existent request and response', ->
      beforeEach ->
        @Flow.findOne = sinon.stub().returns When.reject(new Error('no flow'))
        request = 
          params: 
            id: 'bacon-trigger'
        @response = {}
        @response.status = sinon.stub().returns @response
        @response.end = sinon.spy()
        @sut.trigger(request, @response)      

      it 'should call Flow.findOne with nodes.id query', ->
        expect(@Flow.findOne).to.have.been.calledWith {'nodes.id': 'bacon-trigger'}
    
      it 'should call response.status(404) and response.end()', ->
        expect(@response.status).to.have.been.calledWith 404
        expect(@response.end).to.have.been.called



