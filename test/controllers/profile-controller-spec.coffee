_                = require 'lodash'
request          = require 'request'
When             = require 'when'
ProfileController = require '../../app/controllers/profile-controller'

describe 'ProfileController', ->
  beforeEach ->
    @sut = new ProfileController()
    @response =
      send:   sinon.spy(=> @response) # Return response so it can be chained
      status: sinon.spy(=> @response)

  it 'exists', ->
    expect(@sut).to.exist
   