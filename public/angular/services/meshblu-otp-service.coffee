class MeshbluOTPService
  constructor: ($http, MESHBLU_OTP_URL) ->
    @http = $http
    @MESHBLU_OTP_URL = MESHBLU_OTP_URL

  generate: ({uuid, token, metadata}, callback) =>
    @http({
      method: 'POST',
      url: "#{@MESHBLU_OTP_URL}/generate/#{uuid}/#{token}",
      data: metadata
    }).then((response) =>
      return callback new Error('Invalid response') if response.status != 201
      callback null, response.data
    , (response) =>
      console.error 'generate otp error', response.status, response.data
      callback new Error('Response error')
    )

angular.module('octobluApp').service 'MeshbluOTPService', MeshbluOTPService
