describe('RubberService', function () {
  beforeEach(function () {
    var _this = this;

    module('octobluApp');
    inject(function(RubberService){
      _this.sut = RubberService;
    });
  });

  it('should instantiate', function () {
    expect(this.sut).to.exist
  });
});
