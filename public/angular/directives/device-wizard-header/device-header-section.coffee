angular.module('octobluApp')
  .directive 'deviceWizardHeaderSection', ->
    restrict: 'E'
    templateUrl: '/angular/directives/device-wizard-header/device-wizard-header-section.html'
    replace: true
    scope:
      title:   '@'
      name:    '@'
      logo:    '@'
      missing: '='
