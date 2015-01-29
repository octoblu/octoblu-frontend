describe 'AuthService', =>
  beforeEach ->
    module 'octobluApp', () =>


    inject (_$httpBackend_) =>
      @httpBackend = _$httpBackend_
      @httpBackend.whenGET('/api/auth').respond 200
      @httpBackend.whenGET('/pages/octoblu.html').respond 200
      @httpBackend.whenGET('/pages/home.html').respond 200
      @httpBackend.whenGET('/pages/material.html').respond 200
      @httpBackend.whenGET('/api/nodes').respond 200, []
      @httpBackend.flush()

    inject (AuthService) =>
      @sut = AuthService


  it 'should exist', ->
    expect(@sut).to.exist

  describe 'resetToken', ->
    it 'should exist', ->
      expect(@sut.resetToken).to.exist

    describe 'when it is called', ->
      it 'should post to the octoblu resetToken endpoint', ->
        @httpBackend.expectPOST('/api/reset-token').respond 201
        @sut.resetToken()
        @httpBackend.flush()

      describe 'when the server returns with an error', ->
        it 'should reject it\'s promise', (done)->
          @httpBackend.expectPOST('/api/reset-token').respond 400
          @sut.resetToken().then( ->
            assert false, 'things failed! we shouldn\'t say they are good.'
            done()
          ).catch( -> done() )

          @httpBackend.flush()


      describe 'when the server returns with a token', ->
        it 'should resolve the promise with that token', (done)->
          @httpBackend.expectPOST('/api/reset-token').respond 201, 5
          @sut.resetToken().then( (token) ->
            expect(token).to.equal(5)
            done()
          ).catch(()->
            assert false, 'things should not have failed, but they did'
          )

          @httpBackend.flush()

      describe 'when the server returns with a different token', ->
        it 'should resolve the promise with that token', (done)->
          @httpBackend.expectPOST('/api/reset-token').respond 201, 8
          @sut.resetToken().then( (token) ->
            expect(token).to.equal(8)
            done()
          ).catch(()->
            assert false, 'things should not have failed, but they did'
          )

          @httpBackend.flush()
