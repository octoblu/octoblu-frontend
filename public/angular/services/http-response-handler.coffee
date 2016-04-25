class HttpResponseHandler
  handle: (request) =>
    request.then (response) =>
      if response.status >= 400
        message = "server returned a #{response.status}, message: #{response.data}"
        throw new Error message

      response.data

angular.module("octobluApp").service "HttpResponseHandler", HttpResponseHandler
