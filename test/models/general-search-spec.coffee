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

  describe '->query', ->
    beforeEach ->
      @sut = new GeneralSearch

    it 'should be a function', ->
      expect(@sut.query).be.a 'function'

    describe 'when called', ->
      beforeEach ->
        @result = @sut.query()

      it 'should return an object', ->
        expect(@result).to.be.an 'object'

      it 'should have an empty "or" filter section', ->
        expect(@result.filter.or).to.be.empty

    describe 'when called with a searchQuery of duckhunt and uuids', ->
      beforeEach ->
        @result = @sut.query 'duckhunt', ['uber', 'something']

      it 'should be inject uuid filters', ->
        expect(@result.filter.or).to.have.same.deep.members [
          { term : {"fromUuid.raw": "something"}}
          { term : {"toUuid.raw": "something"}}
          { term : {"fromUuid.raw": "uber"}}
          { term : {"toUuid.raw": "uber"}}
        ]

      it 'should inject query', ->
        expect(@result.query.match._all.query).to.equal 'duckhunt'

    describe 'when called with a searchQuery of huntduck', ->
      beforeEach ->
        @result = @sut.query 'huntduck'

      it 'should inject the query', ->
        expect(@result.query.match._all.query).to.equal 'huntduck'

  describe '->requestParams', ->
    describe 'when instantiated with karatechicken', ->
      beforeEach ->
        @uri = 'http://karatechicken.io'
        @sut = new GeneralSearch @uri, 'kinda-a-query'
        @result = @sut.requestParams 'kinda-a-query', ['uuid1', 'uuid2']

      it 'should have a url of karatechicken with the path added', ->
        expect(@result.url).to.equal 'http://karatechicken.io/meshblu_events_300/_search'

      it 'should have a method of POST', ->
        expect(@result.method).to.equal 'POST'

      it 'should have the query in the json object', ->
        expect(@result.json.query.match._all.query).to.equal 'kinda-a-query'

    describe 'when instantiated with an empty query', ->
      beforeEach ->
        @uri = 'http://karatechicken.io'
        @sut = new GeneralSearch @uri, ''
        @result = @sut.requestParams '', ['uuid1', 'uuid2']

      it 'should have a url of karatechicken with the path added', ->
        expect(@result.url).to.equal 'http://karatechicken.io/meshblu_events_300/_search'

      it 'should have a method of POST', ->
        expect(@result.method).to.equal 'POST'

      it 'should have the query in the json object', ->
        expect(@result.json).not.to.have.property 'query'

    describe 'when instantiated with firechicken', ->
      beforeEach ->
        @uri = 'http://firechicken.io'
        @sut = new GeneralSearch @uri
        @result = @sut.requestParams('kinda-a-query')

      it 'should have a url of firechicken', ->
        expect(@result.url).to.equal 'http://firechicken.io/meshblu_events_300/_search'

  describe '->fetch', ->
    describe 'when instantiated with karatechicken', ->
      beforeEach ->
        @fromUuid = 'gooeyuuid'
        @sut = new GeneralSearch 'some-url', 'kinda-a-query', @fromUuid, @dependencies
        @sut.requestParams = sinon.stub().returns {hop: 'chicken'}

      describe 'when it is called', ->
        beforeEach ->
          @sut.deviceCollection.fetchAll = sinon.stub().returns When [{uuid: 'k2'}]
          result = { worker: "sweet", fromUuid: @fromUuid, sweet: 1, bacon: 3 }
          hits = [{ "_id": "123", "_source": result }]
          @request.yields null, {statusCode: 200}, { hits : { hits : hits }}
          @sut.fetch("bacon").then (@result) =>

        it 'should call fetch', ->
          expect(@sut.deviceCollection.fetchAll).to.have.been.called

        it 'should call requestParams with the devices of the ownerUuid', ->
          expect(@sut.requestParams).to.have.been.calledWith('kinda-a-query', ['k2',@fromUuid])

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
