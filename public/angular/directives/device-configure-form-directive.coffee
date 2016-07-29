angular.module('octobluApp').directive 'deviceConfigureForm', ->
  restrict: 'E'
  controller: 'DeviceConfigureFormController'
  templateUrl: '/pages/device-configure-form.html'
  replace: true
  scope:
    model: '='
    selectedSchemaKey: '='
    uuid: '='
    flowId: '='
    nodeId: '='
    sendResponseTo: '='
