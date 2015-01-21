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

