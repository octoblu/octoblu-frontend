class GenerateDeviceInstallerController
  constructor: ($scope, MeshbluHttpService, MeshbluOTPService) ->
    @scope = $scope
    @MeshbluHttpService = MeshbluHttpService
    @MeshbluOTPService = MeshbluOTPService
    @linkText = "Download Installer [Beta] [Mac OS X only]"

  generateLink: =>
    @linkText = "Downloading..."
    @generating = true
    {uuid, type} = @scope.device
    @MeshbluHttpService.generateAndStoreToken uuid, {}, (error, token) =>
      return console.error error if error?
      metadata = @getMetadata {type}
      @MeshbluOTPService.generate {uuid, token, metadata}, (error, result) =>
        return console.error error if error?
        {key} = result
        @download @getFileName({key, type}), @getInstallerURI()

  isLegacy: ({connector}) =>
    return false if connector in ["bean", "say-hello"]
    return true

  getInstallerURI: () =>
    return "https://meshblu-connector.octoblu.com/apps/osx-installer/v2.1.3/MeshbluConnectorInstaller.dmg"

  getMetadata: ({type}) =>
    connector = @getConnector {type}
    return {
      legacy: @isLegacy({connector}),
      node: "v5.5.0",
      connector: connector,
      dependency_manager: "v1.0.0",
      connector_installer: "v3.0.1"
    }

  download: (fileName, uri) =>
    link = document.createElement "a"
    link.download = fileName
    uriEncoded = encodeURIComponent(uri)
    fileNameEncoded = encodeURIComponent(fileName)
    link.href = "https://file-downloader.octoblu.com/download?fileName=#{fileNameEncoded}&uri=#{uriEncoded}"
    link.click()

  getConnector: ({type}) =>
    return _.last(type.split(':'))

  getFileName: ({key, type}) =>
    connector = @getConnector {type}
    return "MeshbluConnectorInstaller-#{key}.dmg"

angular.module('octobluApp').controller 'GenerateDeviceInstallerController', GenerateDeviceInstallerController
