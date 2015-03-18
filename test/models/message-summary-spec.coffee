When = require 'when'
MessageSummary = require '../../app/models/message-summary'

describe 'MessageSummary', ->
  beforeEach ->
    @DeviceCollection = sinon.stub()
    @request = sinon.stub().yields null, {statusCode: 200}, {aggregations: {sent: {sent: {buckets: []}}, received: {received: {buckets: []}}}}
    @dependencies = {request: @request, DeviceCollection: @DeviceCollection}

  describe 'constructor', ->
    beforeEach ->
      @sut = new MessageSummary null, 'Antman', 'manant', @dependencies

    it 'should instantiate a DeviceCollection with the ownerUuid', ->
      expect(@DeviceCollection).to.have.been.calledWith 'Antman', 'manant'

  describe 'constructor with a different owner', ->
    beforeEach ->
      @sut = new MessageSummary null, 'Hatman', 'manhat', @dependencies

    it 'should instantiate a DeviceCollection with that ownerUuid', ->
      expect(@DeviceCollection).to.have.been.calledWith 'Hatman', 'manhat'

  describe '->fetch', ->
    describe 'when it is called', ->
      beforeEach ->
        @sut = new MessageSummary null, 'Antman', 'manAnt', @dependencies
        @sut.deviceCollection.fetchAll = sinon.stub().returns When []
        @sut.requestParams = sinon.stub()
        @sut.fetch()

      it 'should call deviceCollection.fetchAll', ->
        expect(@sut.deviceCollection.fetchAll).to.have.been.called

      it 'should call requestParams with the ownerUuid', ->
        expect(@sut.requestParams).to.have.been.calledWith ['Antman']

    describe 'when it is called with Dayman', ->
      beforeEach ->
        @sut = new MessageSummary null, 'Dayman', 'manDay', @dependencies
        @sut.deviceCollection.fetchAll = sinon.stub().returns When []
        @sut.requestParams = sinon.stub()
        @sut.fetch()

      it 'should call deviceCollection.fetchAll', ->
        expect(@sut.deviceCollection.fetchAll).to.have.been.called

      it 'should call requestParams with the ownerUuid', ->
        expect(@sut.requestParams).to.have.been.calledWith ['Dayman']

    describe 'when request returns with an error', ->
      beforeEach ->
        @ogError = new Error('.ogg files are not supported')
        @dependencies.request = sinon.stub().yields @ogError, null, null
        @sut = new MessageSummary null, 'Dayman', 'manDay', @dependencies
        @sut.deviceCollection.fetchAll = sinon.stub().returns When []
        @sut.requestParams = sinon.stub()
        @sut.fetch().catch (@error) =>

      it 'should reject the promise with an error', ->
        expect(@error).to.have.that.same.is.equal @ogError

    describe 'when request returns with a statusCode not equal to 200', ->
      beforeEach ->
        @ogError = new Error('.ogg files are not supported')
        @dependencies.request = sinon.stub().yields null, {statusCode: 69}, null
        @sut = new MessageSummary null, 'Dayman', 'manDay', @dependencies
        @sut.deviceCollection.fetchAll = sinon.stub().returns When []
        @sut.requestParams = sinon.stub()
        @sut.fetch().catch (@error) =>

      it 'should reject with the request error', ->
        expect(@error.message).to.equal 'elasticsearch error'

    describe 'when it is called and the deviceCollection returns different results', ->
      beforeEach ->
        @sut = new MessageSummary null, 'Antman', 'manAnt', @dependencies
        @sut.deviceCollection.fetchAll = sinon.stub().returns When [{uuid: 'Cpt. Overalls'}]
        @sut.requestParams = sinon.stub()
        @sut.fetch()

      it 'should call deviceCollection.fetchAll', ->
        expect(@sut.requestParams).to.have.been.calledWith ['Antman', 'Cpt. Overalls']

    describe 'when requestParams returns with some data', ->
      beforeEach ->
        @sut = new MessageSummary null, 'Antman', 'manAnt', @dependencies
        @sut.deviceCollection.fetchAll = sinon.stub().returns When()
        @sut.requestParams = sinon.stub().returns 'dr.freeze' : 1
        @request.yields null, {statusCode: 200}, {aggregations: {sent: {sent: {buckets: [{key: 'Evil', doc_count: 56}]}}, received: {received: {buckets: []}}}}
        @sut.fetch().then (@result) =>

      it 'should call request with that data', ->
        expect(@request).to.have.been.calledWith 'dr.freeze' : 1

      it 'should resolve with an Evil sent count of 56', ->
        item = @result[0]
        expect(item.uuid).to.equal 'Evil'
        expect(item.sent).to.equal 56

    describe 'when requestParams returns with some other data', ->
      beforeEach ->
        @sut = new MessageSummary null, 'Antman', 'manAnt', @dependencies
        @sut.deviceCollection.fetchAll = sinon.stub().returns When()
        @sut.requestParams = sinon.stub().returns 'dr.freeze' : 1
        response =
          aggregations:
            sent:
              sent:
                buckets: [
                  {key: 'Deeds', doc_count: 5},
                  {key: 'promises', doc_count: 5000}
                ]
            received:
              received:
                buckets: [
                  {key: 'Deeds', doc_count: 9},
                  {key: 'promises', doc_count: 400}
                ]

        @request.yields null, {statusCode: 200}, response
        @sut.fetch().then (@result) =>

      it 'should call request with that data', ->
        expect(@request).to.have.been.calledWith 'dr.freeze' : 1

      it 'should resolve with Deeds of 5 and Promises of 5000', ->
        expect(@result).to.have.same.deep.members [
          { uuid: 'Deeds', sent: 5, received: 9 }
          { uuid: 'promises', sent: 5000, received: 400 }
        ]

    describe 'when requestParams returns with some other data', ->
      beforeEach ->
        @sut = new MessageSummary null, 'Antman', 'manAnt', @dependencies
        @sut.deviceCollection.fetchAll = sinon.stub().returns When()
        @sut.requestParams = sinon.stub().returns 'mr.pib' : 6
        @sut.fetch()

      it 'should call request with that data', ->
        expect(@request).to.have.been.calledWith 'mr.pib' : 6

  describe '->requestParams', ->
    describe 'when it is instantiated with a superhero job search engine url', ->
      beforeEach ->
        @sut = new MessageSummary 'http://superjobs.io', 'Antman', 'manAnt', @dependencies

      it 'should use that search engine, with meshblu_events_300/_search added', ->
        expect(@sut.requestParams().url).to.equal 'http://superjobs.io/meshblu_events_300/_search?search_type=count'

      it 'should set the method to "POST"', ->
        expect(@sut.requestParams().method).to.equal 'POST'

      describe 'when called with BogeyMan', ->
        it 'should include the from uuid as an "or" term', ->
          @result = @sut.requestParams(['BogeyMan'])
          terms = @result.json.aggs.sent.filter.or
          expect(terms).to.include {
            term: {'fromUuid.raw': 'BogeyMan'}
          }

        it 'should include the to uuid as an "or" term', ->
          @result = @sut.requestParams(['BogeyMan'])
          terms = @result.json.aggs.received.filter.or
          expect(terms).to.include {
            term: {'toUuid.raw': 'BogeyMan'}
          }

      describe 'when called with MonkeyMan', ->
        it 'should include the from uuid as an "or" term', ->
          @result = @sut.requestParams(['MonkeyMan'])
          terms = @result.json.aggs.sent.filter.or
          expect(terms).to.deep.equal [{
            term: {'fromUuid.raw': 'MonkeyMan'}
          }]

        it 'should include the to uuid as an "or" term', ->
          @result = @sut.requestParams(['MonkeyMan'])
          terms = @result.json.aggs.received.filter.or
          expect(terms).to.deep.equal [{
            term: {'toUuid.raw': 'MonkeyMan'}
          }]

    describe 'when it is instantiated with a superhero job search engine url', ->
      beforeEach ->
        @sut = new MessageSummary 'http://heroes.monster.com', 'Antman', 'manAnt', @dependencies

      it 'should use that search engine', ->
        expect(@sut.requestParams().url).to.equal 'http://heroes.monster.com/meshblu_events_300/_search?search_type=count'


