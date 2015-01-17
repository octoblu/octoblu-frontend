describe "NotifyService", ->
  beforeEach ->
    module 'octobluApp', ($provide) =>
       @mdToast = new FakeToast()
       $provide.value '$mdToast', @mdToast
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

class FakeToast
  constructor: ->
    @show = sinon.spy()
    @simple = sinon.stub()

    @simple.returns new FakeToastPreset


class FakeToastPreset
  constructor: ->
    @position = sinon.spy()
    @_options = {}
