{beforeEach, describe, it} = window
{expect} = window
{inject} = window

describe 'DeviceNodeService', ->
  beforeEach ->
    @NodeConversionService = {}
    @ThingService = {}

    module 'octobluApp', ($provide) =>
      $provide.value 'NodeConversionService', @NodeConversionService
      $provide.value 'ThingService', @ThingService
      return

    inject ($q, $rootScope) =>
      @q = $q
      @rootScope = $rootScope

    inject (DeviceNodeService) =>
      @sut = DeviceNodeService

  describe '->constructor', ->
    it 'should exist', ->
      expect(@sut).to.exist

  describe '->convertDevice', ->
    describe 'given a legacy schema device', ->
      beforeEach ->
        @result = @sut.convertDevice {}

      it 'should add a category', ->
        expect(@result.category).to.deep.equal 'device'

      it 'should add useStaticMessage', ->
        expect(@result.useStaticMessage).to.be.true

      it 'should detect my schema version and not add a noPayloadWrapper key', ->
        expect(@result.noPayloadWrapper).not.to.exist

    describe 'given a schema 1.0.0 device', ->
      beforeEach ->
        @result = @sut.convertDevice {
          schemas:
            version: '1.0.0'
        }

      it 'should add a category', ->
        expect(@result.category).to.deep.equal 'device'

      it 'should add useStaticMessage', ->
        expect(@result.useStaticMessage).to.be.true

      it 'should detect my schema version and add a noPayloadWrapper key', ->
        expect(@result.noPayloadWrapper).to.be.true
