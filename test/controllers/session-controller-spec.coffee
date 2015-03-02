SessionController = require '../../app/controllers/session-controller'

describe 'SessionController', ->
  describe '->show', ->
    beforeEach ->
      class UserSession
        constructor: ->
          @create = UserSession.instanceCreate

        @instanceCreate: sinon.stub()

      @dependencies = UserSession: UserSession
      @sut = new SessionController @dependencies

    describe 'when called with a uuid and token', ->
      beforeEach ->
        @request  = query: {uuid: 'fastball', token: 'outahere'}
        @sut.show @request, null
        
      it 'should call UserSession.create', ->
        expect(@dependencies.UserSession.instanceCreate).to.have.been.calledWith 'fastball', 'outahere'
      
    describe 'when called with a different uuid and token', ->
      beforeEach ->
        @request  = query: {uuid: 'fed-up', token: 'barista'}
        @sut.show @request, null
        
      it 'should call UserSession.create', ->
        expect(@dependencies.UserSession.instanceCreate).to.have.been.calledWith 'fed-up', 'barista'

    describe 'when show is called and userSession.create responds with an error', ->
      beforeEach ->
        @dependencies.UserSession.instanceCreate.yields new Error('Whoops')
        @response = send: sinon.spy()
        @sut.show {query: {uuid: 'a', token: 'b'}}, @response

      it 'should call response.send with a 500', ->
        expect(@response.send).to.have.been.calledWith 500

    describe 'when userSession.create responds with a uuid and a new token', ->
      beforeEach ->
        @dependencies.UserSession.instanceCreate.yields null, uuid: 'fastball', token: 'homerun'
        @response = send: sinon.spy()
        @sut.show {query: {uuid: 'a', token: 'b'}}, @response

      it 'should call response.send with a 200', ->
        expect(@response.send).to.have.been.calledWith 200



