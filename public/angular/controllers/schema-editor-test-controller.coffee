class SchemaEditorTestController
  constructor: ($scope) ->
    @model = {}
    @schema =
      type: "object"
      properties:
        name:
          type: "string"
          minLength: 2
          title: "Name"
          escription: "Name or alias"
        title:
          type: "string",
          enum: ['dr','jr','sir','mrs','mr','NaN','dj']

    @form = [
      "*"
    ]

    $scope.$watch (=> @model), (=> console.log '@model changed'), true


angular.module('octobluApp').controller 'SchemaEditorTestController', SchemaEditorTestController
