GeneralSearch = require '../../app/models/general-search'
When = require 'when'

describe 'GeneralSearch', ->
  beforeEach ->
    @request = sinon.stub().yields null, {}, null
    @DeviceCollection = sinon.stub()
    @dependencies = {request: @request, DeviceCollection: @DeviceCollection}

  describe 'constructor', ->
    beforeEach ->
      @sut = new GeneralSearch 'something', 'kinda-a-query', 'Wishbone', @dependencies

    it 'should instantiate a DeviceCollection with the ownerUuid', ->
      expect(@DeviceCollection).to.have.been.calledWith 'Wishbone'


  describe 'constructor part deux', ->
    beforeEach ->
      @sut = new GeneralSearch 'something', 'kinda-a-query', 'Spengebeb', @dependencies
    it 'should instantiate a DeviceCollection with the ownerUuid', ->
      expect(@DeviceCollection).to.have.been.calledWith 'Spengebeb'

  describe '->requestParams', ->
    describe 'when instantiated with karatechicken', ->
      beforeEach ->
        @uri = 'http://karatechicken.io'
        @sut = new GeneralSearch @uri, 'kinda-a-query', 'gooeyuuid', @dependencies
        @result = @sut.requestParams ['uuid1', 'uuid2']

      it 'should have a url of karatechicken with the path added', ->
        expect(@result.url).to.equal 'http://karatechicken.io/skynet_trans_log/_search'

      it 'should have a method of POST', ->
        expect(@result.method).to.equal 'POST'

      it 'should have the query in the json object', ->
        expect(@result.json.query.match._all.query).to.equal 'kinda-a-query'

    describe 'when instantiated with firechicken', ->
      beforeEach ->
        @uri = 'http://firechicken.io'
        @sut = new GeneralSearch @uri, 'kinda-a-query', 'gooeyuuid', @dependencies
        @result = @sut.requestParams()

      it 'should have a url of firechicken', ->
        expect(@result.url).to.equal 'http://firechicken.io/skynet_trans_log/_search'

  describe '->fetch', ->
    describe 'when instantiated with karatechicken', ->
      beforeEach ->
        @fromUuid = 'gooeyuuid'
        @sut = new GeneralSearch 'some-url', 'kinda-a-query', @fromUuid, @dependencies
        @sut.requestParams = sinon.stub().returns {hop: 'chicken'}

      describe 'when it is called', ->
        beforeEach ->
          @sut.deviceCollection.fetchAll = sinon.stub().returns When [{uuid: @fromUuid}, {uuid: 'k2'}]
          result = { worker: "sweet", fromUuid: @fromUuid, sweet: 1, bacon: 3 }
          hits = [{ "_id": "123", "_source": { "@fields": result} }]
          @request.yields null, {statusCode: 200}, { hits : { hits : hits }}
          @sut.fetch("bacon").then (@result) =>

        it 'should call fetch', ->
          expect(@sut.deviceCollection.fetchAll).to.have.been.called

        it 'should call fetch with a query', ->
          expect(@sut.deviceCollection.fetch).to.have.been.calledWith 

        it 'should call requestParams with the devices of the ownerUuid', ->
          expect(@sut.requestParams).to.have.been.called

        it 'should make a rest request with the requestParams', ->
          expect(@request).to.have.been.calledWith {hop: 'chicken'}

        it 'should sane-itize the results', ->
          expect(@result).to.deep.equal [{sweet : 1, bacon : 3, fromUuid: @fromUuid }]

      describe 'when called and request yields an error', ->
        beforeEach ->
          @sut.deviceCollection.fetchAll = sinon.stub().returns When [{uuid: 'chickenger'}]
          @requestError = new Error('oops')
          @request.yields @requestError
          @sut.fetch().catch (@error) =>

        it 'should reject with the request error', ->
          expect(@error).to.equal @requestError

      describe 'when called and request yields a response with a statusCode error', ->
        beforeEach ->
          @sut.deviceCollection.fetchAll = sinon.stub().returns When [{uuid: 'chickenger'}]
          @request.yields null, statusCode: 500, {oops: 'problem'}
          @sut.fetch().catch (@error) =>

        it 'should reject with the request error', ->
          expect(@error.message).to.equal 'elasticsearch error'
