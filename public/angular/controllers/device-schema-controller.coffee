class DeviceSchemaController
  constructor: ($scope, $http) ->
    @scope = $scope
    @http = $http
    @scope.$watch 'device', (device) =>
      return unless device?
      @scope.options = "{formDefaults: {ngModelOptions: {updateOn: 'default blur', debounce: {default: 3000, blur: 0}}}}" unless @scope.saveImmediately

      async.parallel [
        async.apply @addSchemaToScope, device, "#{@scope.schemaType}Schema"
        async.apply @addSchemaToScope, device, "#{@scope.schemaType}FormSchema"
      ], (error, results) =>
        [schema, form] = results
        @scope.schema = schema ? {}
        @scope.form = form ? ['*']

    @scope.$watch 'model.subschema', (newSubschema, oldSubschema) =>
      return unless oldSubschema? && newSubschema?
      return if oldSubschema == newSubschema

      @scope.model = subschema: newSubschema

  addSchemaToScope : (device, schemaType, callback=->) =>
    return callback null, device[schemaType] if device[schemaType]?
    @loadSchemaFromUrl device[schemaType + 'Url'], (error, schema) =>
      # ignore error
      # return callback error if error?
      callback null, schema

  loadSchemaFromUrl : (url, callback) =>
    return callback null unless url?
    @http.get(url).success((data, status, headers, config) ->
      callback null, data
    ).error (data, status, headers, config) ->
      callback new Error('error getting schema from url')

angular.module('octobluApp').controller 'DeviceSchemaController', DeviceSchemaController
