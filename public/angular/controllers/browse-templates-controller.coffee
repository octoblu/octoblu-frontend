class BrowseTemplatesController
  constructor: ($scope, SHARED_TEMPLATES) ->
    @templates = SHARED_TEMPLATES
    $scope.templates = @templates

    _.each @templates, (template, i) =>
        template.color = "##{i[0...6]}"


angular.module('octobluApp').controller 'BrowseTemplatesController', BrowseTemplatesController
