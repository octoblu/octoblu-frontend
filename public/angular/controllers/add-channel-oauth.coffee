class addChannelOauthController
  constructor: (OCTOBLU_API_URL, $scope, $window, nodeType, channelService) ->
    $scope.redirectLoading = true
    channelService.getById(nodeType.channelid).then (channel) =>
      @channel = channel.type.replace('channel:', '')
      $window.location.href = "#{OCTOBLU_API_URL}/api/oauth/#{@channel}"

angular.module('octobluApp').controller 'addChannelOauthController', addChannelOauthController
