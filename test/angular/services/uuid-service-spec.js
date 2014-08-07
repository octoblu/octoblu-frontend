describe('UUIDService', function () {
  var sut, fakeUUID;

  beforeEach(function () {
    module('octobluApp');

    module('octobluApp', function($provide) {
      fakeUUID = new FakeUUID();
      $provide.value('$window', {uuid: fakeUUID});
    })

    inject(function(UUIDService){
      sut = UUIDService;
    })
  });

  it('should exist', function () {
    expect(sut).to.exist;
  });

  describe('#v1', function () {
    it('should call v1 on $window.uuid', function () {
      sut.v1();
      expect(fakeUUID.v1).to.have.been.called;
    });

    it('should return the result of $window.uuid.v1()', function () {
      fakeUUID.v1.returns = {'something': 'unique'};
      expect(sut.v1()).to.equal(fakeUUID.v1.returns);
    });
  });
});

var FakeUUID = function(){
  var _this = this;

  _this.v1 = sinon.spy(function(){
    return _this.v1.returns;
  });

  return this;
}
