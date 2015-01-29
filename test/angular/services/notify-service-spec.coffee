describe "NotifyService", =>
  beforeEach ->
    module 'octobluApp', ($provide) =>
      @mdToast = new FakeToast
      @mdDialog = new FakeDialog
      $provide.value '$mdToast', @mdToast
      $provide.value '$mdDialog', @mdDialog
      return

    inject (NotifyService) =>
      @sut = NotifyService


  it "should exist", ->
    expect(@sut).to.exist

  it "should have a notify function", ->
    expect(@sut.notify).to.exist


  it "should call $mdToast.show when notify is called", ->
    @sut.notify 'hello!'
    expect(@mdToast.show).to.have.been.called

  it "should call $mdToast.show with an object with a content property when notify is called", ->
    @sut.notify 'hello!'
    toast = @mdToast.simple.args[0][0]
    expect(toast).to.equal('hello!')

  it "should call $mdToast.simple sometime?", ->
    @sut.notify 'hello!'
    expect(@mdToast.simple).to.have.been.called

  it "should have an alert function", ->
    expect(@sut.alert).to.exist

  it "should call $mdDialog.alert with an object with a title, content, and ok text when NotifyService.alert is called", ->
    @sut.alert title: 'hello', content: 'hi'
    expect(@mdDialog.alert).to.be.calledWith(title: 'hello', content: 'hi', ok: 'ok')

  describe 'dialog', ->
    it 'should exist', ->
      expect(@sut.confirm).to.exist;

    describe 'when confirm is called', ->
      it 'should call mdDialog.confirm', ->
        @sut.confirm()
        expect(@mdDialog.confirm).to.have.been.called

      it 'should call mdDialog.show', ->
        @sut.confirm();
        expect(@mdDialog.confirm).to.have.been.called

    describe 'when confirm is called with an object containing a title and content', ->
      it 'should call mdDialog.confirm with the title, content, and defaults for the buttons', ->
        @sut.confirm title: 'Are you a human bean?', content: 'Click ok if you are not a human bean, cancel if you are a robot bean'
        expect(@mdDialog.confirm).to.have.been.calledWith title: 'Are you a human bean?', content: 'Click ok if you are not a human bean, cancel if you are a robot bean', ok: 'ok', cancel: 'cancel'

      describe 'when mdDialog.confirm returns a configuration object', ->
        beforeEach ->
          @mdDialog.confirm = sinon.stub().returns hello: 'world'

        it 'should call mdDialog.show with that config object', ->
          @sut.confirm()
          expect(@mdDialog.show).to.be.calledWith hello: 'world'


      describe 'when mdDialog.confirm returns a different configuration object', ->
        beforeEach ->
          @mdDialog.confirm = sinon.stub().returns who: 'knows'

        it 'should call mdDialog.show with that config object', ->
          @sut.confirm()
          expect(@mdDialog.show).to.be.calledWith who: 'knows'

    describe 'when confirm is called with an object containing a different title and content', ->
      it 'should call mdDialog.confirm with a different title, content, and defaults for the buttons', ->
        @sut.confirm title: 'Are you a robot bean?', content: 'Click ok if you are a human bean, cancel if you are not a robot bean'
        expect(@mdDialog.confirm).to.have.been.calledWith title: 'Are you a robot bean?', content: 'Click ok if you are a human bean, cancel if you are not a robot bean', ok: 'ok', cancel: 'cancel'



class FakeToast
  constructor: ->
    @show = sinon.spy()
    @simple = sinon.stub()

    @simple.returns new FakeToastPreset


class FakeToastPreset
  constructor: ->
    @position = sinon.spy()
    @_options = {}

class FakeDialog
  constructor: ->
    @alert = sinon.spy()
    @show = sinon.spy()
    @confirm = sinon.spy()

