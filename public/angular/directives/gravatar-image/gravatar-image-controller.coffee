class GravatarImageController
  constructor: ($scope) ->
    @scope = $scope

    console.log @scope
    console.log @scope.email
    @GRAVITAR_IMAGE_URL = "http://www.gravatar.com/avatar"


    # @emailHash = md5 @scope.email?.toLowerCase()
    # @profileImage = "#{@GRAVITAR_IMAGE_URL}/#{@emailHash}"
    # console.log @scope.email


angular.module('octobluApp').controller 'GravatarImageController', GravatarImageController
