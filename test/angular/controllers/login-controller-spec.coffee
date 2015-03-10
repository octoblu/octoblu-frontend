describe 'LoginController', ->
  beforeEach ->
    module 'octobluApp'

    inject ($controller, $rootScope) =>
      @rootScope = $rootScope
      @sut = $controller 'LoginController', 
        $location:
          host: -> 'the.mothership:1234'
          protocol: -> 'https'
        AUTHENTICATOR_URIS:
          EMAIL_PASSWORD: 'https://login.to.the.grid'
          GOOGLE: 'https://login.to.the.google'
          TWITTER: 'https://login.to.the.twitter'
          GITHUB: 'https://login.to.the.github'
          FACEBOOK: 'https://login.to.the.facebook'


  describe 'emailPasswordLoginUri', ->
    it 'should have one', ->
      expect(@sut.emailPasswordLoginUri).to.equal 'https://login.to.the.grid?callback=https%3A%2F%2Fthe.mothership%3A1234%2Fapi%2Fsession'

  describe 'googleLoginUri', ->
    it 'should have one', ->
      expect(@sut.googleLoginUri).to.equal 'https://login.to.the.google?callback=https%3A%2F%2Fthe.mothership%3A1234%2Fapi%2Fsession'

  describe 'twitterLoginUri', ->
    it 'should have one', ->
      expect(@sut.twitterLoginUri).to.equal 'https://login.to.the.twitter?callback=https%3A%2F%2Fthe.mothership%3A1234%2Fapi%2Fsession'

  describe 'githubLoginUri', ->
    it 'should have one', ->
      expect(@sut.githubLoginUri).to.equal 'https://login.to.the.github?callback=https%3A%2F%2Fthe.mothership%3A1234%2Fapi%2Fsession'

  describe 'facebookLoginUri', ->
    it 'should have one', ->
      expect(@sut.facebookLoginUri).to.equal 'https://login.to.the.facebook?callback=https%3A%2F%2Fthe.mothership%3A1234%2Fapi%2Fsession'

    
