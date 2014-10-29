describe('AddNodeWizardController', function () {
  var sut, scope, nodeTypeService, $rootScope, $q;

  beforeEach(function () {
    module('octobluApp');

    inject(function(_$rootScope_, _$q_){
      $rootScope = _$rootScope_;
      $q = _$q_;
      scope = $rootScope.$new();
    });

    inject(function(_$httpBackend_){
      var $httpBackend = _$httpBackend_;
      $httpBackend.whenGET('/api/auth').respond(200);
      $httpBackend.whenGET('/pages/octoblu.html').respond(200);
      $httpBackend.whenGET('/pages/home.html').respond(200);
      $httpBackend.whenGET('/api/nodes').respond(200, []);
      $httpBackend.flush();
    });

    nodeTypeService = new NodeTypeService();
  });

  describe('when NodeType is a device', function () {
    var state;
    beforeEach(function () {
      state = new State();
      state.params.nodeTypeId = 'deviceid';

      inject(function($controller){
        sut = $controller('AddNodeWizardController', {$scope: scope, $state: state, NodeTypeService: nodeTypeService});
      });
    });

    it('should call AddNodeWizardController.getById with the id', function () {
      expect(nodeTypeService.getById).to.have.been.calledWith(state.params.nodeTypeId);
    });

    describe('when NodeTypeService.getById resolves', function () {
      beforeEach(function () {
        nodeTypeService.getById.resolve({category: 'device'});
        $rootScope.$apply();
      });

      it('should redirect to the add device state', function(){
        expect(state.go).to.have.been.calledWith('ob.nodewizard.adddevice', {nodeTypeId: 'deviceid'});
      });
    });
  });

  describe('when the NodeType is a channel', function () {
    var state;
    beforeEach(function () {
      state = new State();
      state.params.nodeTypeId = 'channelid';

      inject(function($controller){
        sut = $controller('AddNodeWizardController', {$scope: scope, $state: state, NodeTypeService: nodeTypeService});
      });
    });

    it('should call AddNodeWizardController.getById with the id', function () {
      expect(nodeTypeService.getById).to.have.been.calledWith(state.params.nodeTypeId);
    });

    describe('when NodeTypeService.getById resolves', function () {
      beforeEach(function () {
        nodeTypeService.getById.resolve({category: 'channel'});
        $rootScope.$apply();
      });

      it('should redirect to the add channel state', function(){
        expect(state.go).to.have.been.calledWith('ob.nodewizard.addchannel.default-options', {nodeTypeId: 'channelid'});
      });
    });
  });

  describe('when the NodeType is a subdevice', function () {
    var state;
    beforeEach(function () {
      state = new State();
      state.params.nodeTypeId = 'subdeviceid';

      inject(function($controller){
        sut = $controller('AddNodeWizardController', {$scope: scope, $state: state, NodeTypeService: nodeTypeService});
      });
    });

    it('should call AddNodeWizardController.getById with the id', function () {
      expect(nodeTypeService.getById).to.have.been.calledWith(state.params.nodeTypeId);
    });
  });


  var NodeTypeService = function(){
    var self, myQ;
    self = this;

    self.getById = sinon.spy(function(){
      var deferred = $q.defer();
      self.getById.resolve = deferred.resolve;
      return deferred.promise;
    });
    self.getById.resolve = function(){};
  };

  var State = function(){
    var self = this;
    self.params = {};
    self.go = sinon.spy();
  };
});
