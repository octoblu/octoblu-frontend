describe 'FlowEditorService', ->
  beforeEach ->
    module 'octobluApp', ($provide) =>
      return

    inject (FlowEditorService) =>
      @sut = FlowEditorService

  describe '->constructor', ->
    it 'should exist', ->
      expect(@sut).to.exist

  describe '->deleteSelection', ->
    describe 'when called with an activeFlow', ->
      beforeEach ->
        @activeFlow =
          selectedFlowNode: {id: 1}
          links : [
            {to: 1}
            {to: 2}
            {from: 1}
          ]
          nodes: [
            {id:1}
            {id:2}
          ]
        @sut.deleteSelection @activeFlow

      it 'should remove links, linked to the selectedFlowNode', ->
        expect(@activeFlow.links).to.deep.equal [{to: 2}]

      it 'should remove the selected node from the nodes', ->
        expect(@activeFlow.nodes).to.deep.equal [{id: 2}]

      it 'should set activeFlow.selectedFlowNode to null', ->
        expect(@activeFlow.selectedFlowNode).to.be.null

    describe 'when called with another activeFlow', ->
      beforeEach ->
        @activeFlow =
          selectedFlowNode: {id: 3}
          links : [
            {to: 3}
            {to: 1}
            {from: 3}
          ]
          nodes: [
            {id:3}
            {id:1}
          ]
        @sut.deleteSelection @activeFlow

      it 'should remove links, linked to the selectedFlowNode', ->
        expect(@activeFlow.links).to.deep.equal [{to: 1}]

      it 'should remove the selected node from the nodes', ->
        expect(@activeFlow.nodes).to.deep.equal [{id: 1}]

    describe 'when called with an activeFlow with selectedLink', ->
      beforeEach ->
        @activeFlow =
          selectedLink: {to:7, from:8}
          links : [
            {from: 1}
            {to:7,from:8}
          ]
        @sut.deleteSelection @activeFlow

      it 'should remove links, linked to the selectedFlowNode', ->
        expect(@activeFlow.links).to.deep.equal [{from: 1}]

      it 'should set activeFlow.selectedLink to null', ->
        expect(@activeFlow.selectedLink).to.be.null

    describe 'when called with an activeFlow but no selectedFlowNode', ->
      beforeEach ->
        @activeFlow =
          links : [
            {to:2}
          ]
          nodes: [
            {id:2}
          ]
        @sut.deleteSelection @activeFlow

      it 'should not modify the links', ->
        expect(@activeFlow.links).to.deep.equal [{to: 2}]

      it 'should not modify the nodes', ->
        expect(@activeFlow.nodes).to.deep.equal [{id: 2}]

    describe 'when called without an activeFlow', ->
      beforeEach ->
        @sut.deleteSelection()

      it 'should return nothing', ->
        expect(@activeFlow).to.not.exist
