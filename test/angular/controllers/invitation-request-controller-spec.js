describe('InvitationRequestController', function () {
  var sut, scope, invitationService, $rootScope, $q;

  beforeEach(function () {
    module('octobluApp');

    invitationService = new InvitationService();
    inject(function(_$rootScope_, _$q_, $controller){
      $rootScope = _$rootScope_;
      $q = _$q_;
      scope = $rootScope.$new();
      sut = $controller('InvitationRequestController', {
        $scope: scope,
        InvitationService: invitationService
      });
    });
  });

  describe('on initialization', function () {
    it('should define a invitationRequest model', function () {
      expect(scope.invitationRequest).to.exist;
    });

    it('should add a send function to the scope', function () {
      expect(scope.send).to.exist;
    });

  });

  describe('sending a request', function(){


      beforeEach(function(){
        scope.invitationRequest = {first : 'Joe', last : 'smith', email : 'joe@example.com'};
        scope.$digest();
        scope.send()
      });


      it('should call InvitationService.send with the name(first and last) and email', function(){
        expect(invitationService.requestInvite).to.have.been.called;
        expect(invitationService.requestInvite).to.have.been.calledWith(scope.invitationRequest);
      });

  });

  var InvitationService = function(){
    var self;
    self = this;

    self.requestInvite = sinon.spy(function(){
      var deferred = $q.defer();
      self.requestInvite.resolve = deferred.resolve;
      return deferred.promise;
    });
    self.requestInvite.resolve = function(){};
  };

});

