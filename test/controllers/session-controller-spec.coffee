SessionController = require '../../app/controllers/session-controller'
_ = require 'lodash'

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
        @response = 
          send:   sinon.spy(=> @response) # Return response so it can be chained
          status: sinon.spy(=> @response) 

        @dependencies.UserSession.instanceCreate.yields new Error('Whoops')
        @sut.show {query: {uuid: 'a', token: 'b'}}, @response

      it 'should call response.status with a 500', ->
        expect(@response.status).to.have.been.calledWith 500

      it 'should call response.send with a the error message', ->
        expect(@response.send).to.have.been.calledWith SessionController.ERROR_RETRIEVING_SESSION

    describe 'when userSession.create responds with a user', ->
      beforeEach ->
        @request  = query: {uuid: 'a', token: 'onetimetoken'}, login: sinon.spy()
        @response = redirect: sinon.spy()

        @dependencies.UserSession.instanceCreate.yields null, skynet: {uuid: 'a', token: 'permatoken'}
        @sut.show @request, @response

      it 'should call request.login with the user', ->
        expect(@request.login).to.have.been.calledWith skynet: {uuid: 'a', token: 'permatoken'}

      it 'should call response.send with the uuid and token', ->
        expect(@response.redirect).to.have.been.calledWith '/'

    describe 'when userSession.create responds with a different uuid and a new token', ->
      beforeEach ->
        @request  = query: {uuid: 'b', token: 'unotimetoken'}, login: sinon.spy()
        @response = redirect: sinon.spy()
        
        @dependencies.UserSession.instanceCreate.yields null, skynet: {uuid: 'b', token: 'reallypermatoken'}
        @sut.show @request, @response

      it 'should call request.login with the user', ->
        expect(@request.login).to.have.been.calledWith skynet: {uuid: 'b', token: 'reallypermatoken'}

      it 'should call response.send with the uuid and token', ->
        expect(@response.redirect).to.have.been.calledWith '/'
