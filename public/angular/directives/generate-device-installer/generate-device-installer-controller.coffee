class GenerateDeviceInstallerController
  constructor: ($scope, MeshbluHttpService, MeshbluOTPService) ->
    @scope = $scope
    @MeshbluHttpService = MeshbluHttpService
    @MeshbluOTPService = MeshbluOTPService
    @linkText = "Download Installer"

  generateLink: =>
    @linkText = "Downloading..."
    @generating = true
    {uuid, type} = @scope.device
    @MeshbluHttpService.generateAndStoreToken uuid, {}, (error, token) =>
      return console.error error if error?
      @MeshbluOTPService.generate {uuid, token}, (error, result) =>
        return console.error error if error?
        {key} = result
        @download @getFileName({key, type}), "https://meshblu-connector.octoblu.com/apps/MeshbluConnectorInstallerlatest.dmg"

  download: (fileName, uri) =>
    link = document.createElement "a"
    link.download = fileName
    uriEncoded = encodeURIComponent(uri)
    fileNameEncoded = encodeURIComponent(fileName)
    link.href = "https://file-downloader.octoblu.com/download?fileName=#{fileNameEncoded}&uri=#{uriEncoded}"
    link.click()

  getFileName: ({key, type}) =>
    connector = _.last(type.split(':'))
    return "#{connector}-#{key}.dmg"

angular.module('octobluApp').controller 'GenerateDeviceInstallerController', GenerateDeviceInstallerController
