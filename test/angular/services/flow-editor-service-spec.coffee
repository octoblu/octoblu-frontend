describe 'FlowEditorService', =>
  beforeEach ->
    module 'octobluApp', ($provide) =>
      return

    inject (FlowEditorService) =>
      @sut = FlowEditorService

  describe '->constructor', ->
    it 'should exist', ->
      expect(@sut).to.exist

  describe '->deleteSelection', ->
    it 'should exist', ->
      expect(@sut.deleteSelection).to.exist




