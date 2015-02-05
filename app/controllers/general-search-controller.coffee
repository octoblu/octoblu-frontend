GeneralSearch = require '../models/general-search'

class GeneralSearchController
  constructor: (@elasticSearchUri) ->

  show: (request, response) =>
    general_search = new GeneralSearch @elasticSearchUri, request.query.q, request.user.skynet.uuid
    general_search.fetch()
      .then (result) =>
        response.send result
      .catch (error) =>
        response.send 500, error: error.message
        console.error error.body
        console.error JSON.stringify(error.requestParams, null ,2)
        throw error

module.exports = GeneralSearchController
