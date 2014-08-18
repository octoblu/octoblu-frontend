var when = require('when');
var ChannelCollection = require('../../app/collections/channel-collection');

describe('ChannelCollection', function () {
  var sut, getUser, defer, result;

  beforeEach(function(){
    sut     = new ChannelCollection();
    defer = when.defer();
    getUser = sinon.stub(sut, 'getUser');
    getUser.returns(defer.promise);
  });

  describe('fetch', function () {
    beforeEach(function () {
      result = sut.fetch();
    });

    it('should getUser', function () {
      expect(getUser).to.have.been.called;
    });

    describe('when the user returns no api(s)', function(){
      var fakeUser;
      beforeEach(function () {
        fakeUser = {api: []};
        defer.resolve(fakeUser);
      });

      xit('should be empty', function(done){
        result.then(function(apis){
          expect(apis).to.equal([]);
        }).catch(done);
      });
    });
  });
});
