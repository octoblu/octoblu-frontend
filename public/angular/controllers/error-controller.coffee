class ErrorController
  constructor: () ->

  theSaddestOctopus: =>
    return "https://s3-us-west-2.amazonaws.com/octoblu-cdn/sad/octopus.svg"

angular.module('octobluApp').controller 'ErrorController', ErrorController
