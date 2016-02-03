class GravatarImageController
  constructor: ($scope) ->
    @scope = $scope
    @GRAVITAR_IMAGE_URL = "http://www.gravatar.com/avatar"
    @size = @scope.size || 40

    @scope.$watch 'email', =>
      @generateProfileUrl(@scope.email)


  generateProfileUrl: (email) =>
    return unless email?
    @emailHash = md5 @scope.email?.toLowerCase()
    @profileImage = "#{@GRAVITAR_IMAGE_URL}/#{@emailHash}?s=#{@size}&d=retro"

angular.module('octobluApp').controller 'GravatarImageController', GravatarImageController
