FlowAuthCredentialsController = require '../../app/controllers/flow-auth-credentials-controller'
_ = require 'lodash'

describe 'FlowAuthCredentialsController', ->
  describe '->show', ->
    beforeEach ->
      @response =
        send:   sinon.spy(=> @response) # Return response so it can be chained
        status: sinon.spy(=> @response)
      @meshbluHttp = {}
      @octobluDb = {}

      class MeshbluHttp
        constructor: (options) ->
          MeshbluHttp.options = options
          @device = MeshbluHttp.stubDevice
          @getAccessToken = MeshbluHttp.stubGetAccessToken

        @stubDevice: sinon.stub()
        @stubGetAccessToken: sinon.stub()

      @dependencies = MeshbluHttp: MeshbluHttp, octobluDb: @octobluDb

      @sut = new FlowAuthCredentialsController {}, @dependencies
      @sut.getAccessToken = sinon.stub()
      @sut.verifyDevice = sinon.stub()

    describe 'when called with uuid and token', ->
      beforeEach ->
        @sut.verifyDevice.yields null, owner: 'dad'
        @sut.getAccessToken.yields null, token: '1234'
        @request  =
          params:
            id: 'fastball'
          query:
            token: 'outahere'
            type: 'channel:foobar'
            access_token: 'abcd'
        @sut.show @request, @response

      it 'should call meshbluHttp with the device uuid', ->
        expect(@sut.verifyDevice).to.have.been.calledWith 'fastball', 'outahere'

      it 'should call getAccessToken with the owner uuid', ->
        expect(@sut.getAccessToken).to.have.been.calledWith 'dad', 'channel:foobar', 'abcd'

      it 'should return 200', ->
        expect(@response.status).to.have.been.calledWith 200

      it 'should return an access_token', ->
        expect(@response.send).to.have.been.calledWith access_token: '1234'

    describe 'when called with another uuid and token', ->
      beforeEach ->
        @sut.verifyDevice.yields null, owner: 'mom'
        @sut.getAccessToken.yields null, token: '51234'
        @request  =
          params:
            id: 'coke'
          query:
            token: 'pepsi'
            type: 'channel:barfo'
            access_token: 'dcba'
        @sut.show @request, @response

      it 'should call meshbluHttp with the device uuid', ->
        expect(@sut.verifyDevice).to.have.been.calledWith 'coke', 'pepsi'

      it 'should call getAccessToken with the owner uuid', ->
        expect(@sut.getAccessToken).to.have.been.calledWith 'mom', 'channel:barfo', 'dcba'

      it 'should return 200', ->
        expect(@response.status).to.have.been.calledWith 200

      it 'should return an access_token', ->
        expect(@response.send).to.have.been.calledWith access_token: '51234'

    describe 'when called with an invalid uuid and token', ->
      beforeEach ->
        @sut.verifyDevice.yields new Error
        @request  =
          params:
            id: 'coken'
          query:
            token: 'pepsi'
        @sut.show @request, @response

      it 'should call meshbluHttp with the device uuid', ->
        expect(@sut.verifyDevice).to.have.been.calledWith 'coken', 'pepsi'

      it 'should return 401', ->
        expect(@response.status).to.have.been.calledWith 401
