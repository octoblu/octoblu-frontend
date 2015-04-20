describe 'AuthService', ->
  beforeEach ->
    module 'octobluApp', ($provide) =>
      $provide.value '$cookies', {}
      $provide.value '$intercom', {}
      $provide.value '$intercomProvider', {}
      return

    inject ($httpBackend, AuthService) =>
      @httpBackend = $httpBackend

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
