describe 'CWCAuthProxyService', ->
  beforeEach ->
    @OCTOBLU_API_URL = 'bananas.com'
    @CWC_APP_STORE_URL = "https://cwc-store.octoblu.com"
    @CWC_AUTHENTICATOR_PROXY_URL = "burittosaredelicious.com"
    @cookies = @window = {}

    module 'octobluApp', ($provide) =>
      $provide.constant 'OCTOBLU_API_URL', @OCTOBLU_API_URL
      $provide.value '$cookies', @cookies
      $provide.value 'CWC_AUTHENTICATOR_PROXY_URL', @CWC_AUTHENTICATOR_PROXY_URL
      return

    inject ($q, $rootScope, CWCAuthProxyService, $httpBackend) =>
      @q = $q
      @rootScope = $rootScope
      @httpBackend = $httpBackend
      @sut = CWCAuthProxyService

  it 'should exist', ->
    expect(@sut).to.exist

  describe '->authenticateCWCUser', ->
    it 'should exist', ->
      expect(@sut.authenticateCWCUser).to.be.a 'function'

    describe 'when called', ->
      beforeEach ->
        @otp = "push-it-along"
        @customerId = "ATribeCalledQuest"
        @cwcReferralUrl = "https://workspace.cloudburitto.com"

        @cwcAuthInfo =
          device :
            uuid : "you-on-point-phife"
            token: "all-the-time-tip"
          cwcSessionId : "i-left-my-wallet-in-el-segundo"

      it 'should make a request to the CWC authenticator proxy service to authenticate the CWC User', ->
        @httpBackend.expectPOST("#{@CWC_AUTHENTICATOR_PROXY_URL}/authenticate").respond 201, @cwcAuthInfo
        @sut.authenticateCWCUser @otp, @customerId, @cwcReferralUrl
        @httpBackend.flush()

  describe '->createOctobluSession', ->
    it 'should exist', ->
      expect(@sut.createOctobluSession).to.be.a 'function'

    describe 'when called', ->
      beforeEach ->
        @uuid = "push-it-along"
        @token = "ATribeCalledQuest"
        @queryString="uuid=#{@uuid}&token=#{@token}&callbackUrl=#{encodeURIComponent(@CWC_APP_STORE_URL)}"

      it 'should make a request to the octoblu api for public flows', ->
        @httpBackend.expectGET("#{@OCTOBLU_API_URL}/api/session?#{@queryString}").respond 301
        @sut.createOctobluSession @uuid, @token, @CWC_APP_STORE_URL
        @httpBackend.flush()
