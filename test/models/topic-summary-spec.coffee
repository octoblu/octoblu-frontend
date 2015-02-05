TopicSummary = require '../../app/models/topic-summary'
When = require 'when'

describe 'TopicSummary', ->
  beforeEach ->
    @request = sinon.stub().yields null, {}, null
    @DeviceCollection = sinon.stub()
    @dependencies = {request: @request, DeviceCollection: @DeviceCollection}

  describe 'constructor', ->
    beforeEach ->
      @sut = new TopicSummary 'something', 'Wishbone', @dependencies

    it 'should instantiate a DeviceCollection with the ownerUuid', ->
      expect(@DeviceCollection).to.have.been.calledWith 'Wishbone'

  describe 'constructor part deux', ->
    beforeEach ->
      @sut = new TopicSummary 'something', 'Spengebeb', @dependencies
    it 'should instantiate a DeviceCollection with the ownerUuid', ->
      expect(@DeviceCollection).to.have.been.calledWith 'Spengebeb'

  describe '->requestParams', ->
    describe 'when instantiated with zaboomafoo', ->
      beforeEach ->
        @uri = 'http://zaboomafoo.io'
        @sut = new TopicSummary @uri, 'gooeyuuid', @dependencies
        @result = @sut.requestParams ['uuid1', 'uuid2']

      it 'should have a url of zaboomafoo with the path added', ->
        expect(@result.url).to.equal 'http://zaboomafoo.io/skynet_trans_log/_search?search_type=count'

      it 'should have a method of POST', ->
        expect(@result.method).to.equal 'POST'

      it 'should inject the first uuid into the body', ->
        terms = @result.json.aggs.topic_summary.filter.and[1].or

        expect(terms).to.include {
          term: {
            '@fields.fromUuid.raw': 'uuid1'
          }
        }

      it 'should inject the first uuid into the bodyusing the toUuid', ->
        terms = @result.json.aggs.topic_summary.filter.and[1].or

        expect(terms).to.include {
          term: {
            '@fields.toUuid.raw': 'uuid1'
          }
        }

      it 'should inject the second uuid into the body', ->
        terms = @result.json.aggs.topic_summary.filter.and[1].or

        expect(terms).to.include {
          term: {
            '@fields.fromUuid.raw': 'uuid2'
          }
        }

      it 'should inject the second uuid into the body', ->
        terms = @result.json.aggs.topic_summary.filter.and[1].or

        expect(terms).to.include {
          term: {
            '@fields.toUuid.raw': 'uuid2'
          }
        }

    describe 'when instantiated with lambert', ->
      beforeEach ->
        @uri = 'http://lambert.io'
        @sut = new TopicSummary @uri, 'gooeyuuid', @dependencies
        @result = @sut.requestParams()

      it 'should have a url of lambert', ->
        expect(@result.url).to.equal 'http://lambert.io/skynet_trans_log/_search?search_type=count'

      it 'should have no uuids in the json body', ->
        ors = @result.json.aggs.topic_summary.filter.and[1].or
        expect(ors).to.be.empty

  describe '->fetch', ->
    describe 'when instantiated with zaboomafoo', ->
      beforeEach ->
        @sut = new TopicSummary 'some-url', 'gooeyuuid', @dependencies
        @sut.requestParams = sinon.stub().returns {hop: 'frog'}

      describe 'when it is called', ->
        beforeEach ->
          @sut.deviceCollection.fetchAll = sinon.stub().returns When [{uuid: 'g1'}, {uuid: 'g2'}]
          @request.yields null, {statusCode: 200}, {aggregations: {topic_summary: {topics: {buckets: [{key: 'pulse', doc_count: 211}]}}}}
          @sut.fetch().then (@result) =>

        it 'should call fetch', ->
          expect(@sut.deviceCollection.fetchAll).to.have.been.called

        it 'should call requestParams with the devices of the ownerUuid', ->
          expect(@sut.requestParams).to.have.been.calledWith [ 'gooeyuuid', 'g1', 'g2']

        it 'should make a rest request with the requestParams', ->
          expect(@request).to.have.been.calledWith {hop: 'frog'}

        it 'should sane-itize the results', ->
          expect(@result).to.deep.equal [{topic: 'pulse', count: 211}]

      describe 'when it is called and the results are different', ->
        beforeEach ->
          @request.yields null, {statusCode: 200}, {aggregations: {topic_summary: {topics: {buckets: [{key: 'termites', doc_count: 10000}, {key: 'swiper', doc_count: 1}]}}}}
          @sut.deviceCollection.fetchAll = sinon.stub().returns When()
          @sut.fetch().then (@result) =>

        it 'should sane-itize', ->
          expect(@result).to.deep.equal [{topic: 'termites', count: 10000 }, { topic: 'swiper', count: 1}]

      describe 'when called and mydevices are different', ->
        beforeEach ->
          @request.yields null, {statusCode: 200}, {aggregations: {topic_summary: {topics: {buckets: []}}}}
          @sut.deviceCollection.fetchAll = sinon.stub().returns When [{uuid: 'frogger'}]
          @sut.fetch()

        it 'should call requestParams with the devices of the ownerUuid', ->
          expect(@sut.requestParams).to.have.been.calledWith [ 'gooeyuuid', 'frogger']

      describe 'when called and request yields an error', ->
        beforeEach ->
          @sut.deviceCollection.fetchAll = sinon.stub().returns When [{uuid: 'frogger'}]
          @requestError = new Error('oops')
          @request.yields @requestError
          @sut.fetch().catch (@error) =>

        it 'should reject with the request error', ->
          expect(@error).to.equal @requestError

      describe 'when called and request yields a response with a statusCode error', ->
        beforeEach ->
          @sut.deviceCollection.fetchAll = sinon.stub().returns When [{uuid: 'frogger'}]
          @request.yields null, statusCode: 500, {oops: 'problem'}
          @sut.fetch().catch (@error) =>

        it 'should reject with the request error', ->
          expect(@error.message).to.equal 'elasticsearch error'




