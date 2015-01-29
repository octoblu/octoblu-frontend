describe 'profileController', ->
  beforeEach =>
    module 'octobluApp'

    inject ($controller, $rootScope, $q) =>
      @q = $q
      @scope = $rootScope.$new()
      @rootScope = $rootScope
      @AuthService = new FakeAuthService @q
      @NotifyService = new FakeNotifyService @q

      @sut = $controller('profileController', {
        $rootScope : @rootScope,
        $scope : @scope,
        AuthService : @AuthService,
        NotifyService: @NotifyService
      })

  beforeEach ->

  it 'should exist', =>
    expect(@sut).to.exist

   describe 'resetToken', =>
    it 'should add a function called resetToken to the scope', =>
      expect(@scope.resetToken).to.exist

    describe 'when it is called', =>
      it 'should show a confirm dialog to the user', =>
        @scope.resetToken()
        expect(@NotifyService.confirm).to.have.been.calledWith(
          title: 'Reset your token',
          content: 'Resetting your token will cause mobile apps and other apps authenticated as you, to stop working. Are you sure you want to do this?')

      describe 'when the user clicks "ok" on the dialog box', =>
        beforeEach =>
          @NotifyService.confirm.returns @q.when true

        it 'should call resetToken on the user service', =>
          @scope.resetToken()
          @scope.$digest()

          expect(@AuthService.resetToken).to.have.been.called

        describe 'when there is an error resetting the token', =>
          beforeEach =>
            @AuthService.resetToken.returns @q.reject 'Could not reset token'

          it 'should notify the user that resetting the token failed', =>
             @scope.resetToken()
             @scope.$digest()

             expect(@NotifyService.alert).to.have.been.calledWith(title: 'Error Resetting Token', content: 'There was an error resetting your token. Please try again.')

        describe 'when the token is reset successfully', =>
          beforeEach =>
            @AuthService.resetToken.returns @q.when 5
          it 'should notify the user with a dialog containing the token', =>
            @scope.resetToken()
            @scope.$digest()

            expect(@NotifyService.alert).to.have.been.calledWith(title: 'Token Reset', content: 5 )

          it 'shouldn\'t tell the user there was a problem resetting the token. Because there wasn\'t', =>
            @scope.resetToken()
            @scope.$digest()

            expect(@NotifyService.alert).to.not.have.been.calledWith(title: 'Error Resetting Token', content: 'There was an error resetting your token. Please try again.')

        describe 'when the token is reset successfully with a different token', =>
          beforeEach =>
            @AuthService.resetToken.returns @q.when 6
          it 'should notify the user with a dialog containing the token', =>
            @scope.resetToken()
            @scope.$digest()

            expect(@NotifyService.alert).to.have.been.calledWith(title: 'Token Reset', content: 6)


      describe 'when the user clicks "cancel" on the dialog box', =>
        beforeEach =>
          @NotifyService.confirm.returns @q.reject false

        it 'should not call resetToken on the user service', =>
          @scope.resetToken()
          @scope.$digest()

          expect(@AuthService.resetToken).to.not.have.been.called

        it 'should not open the alert with no token', =>
          @scope.resetToken()
          @scope.$digest()
          expect(@NotifyService.alert).to.not.have.been.called


class FakeAuthService
  constructor: (@q)->
   @getCurrentUser = sinon.stub().returns(@q.when(true))
   @resetToken = sinon.stub().returns(@q.when(true))

class FakeNotifyService
  constructor: (@q) ->
    @confirm = sinon.stub().returns(@q.when(true))
    @alert = sinon.stub().returns(@q.when(true))
