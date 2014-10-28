describe('GroupPermissionsService', function(){
    var sut, permissionsService, groupService, $rootScope, $q;

    beforeEach(function () {
      module('octobluApp');

      module('octobluApp', function($provide){
        permissionsService = new FakePermissionsService();
        groupService = new FakeGroupService();

        $provide.value('PermissionsService', permissionsService);
        $provide.value('GroupService', groupService);
      });

      inject(function(_$httpBackend_){
        var $httpBackend = _$httpBackend_;
        $httpBackend.whenGET('/api/auth').respond(200);
        $httpBackend.whenGET('/pages/octoblu.html').respond(200);
        $httpBackend.whenGET('/pages/home.html').respond(200);
        $httpBackend.flush();
      });

      inject(function(GroupPermissionsService, _$rootScope_, _$q_){
        $q = _$q_;
        sut = GroupPermissionsService;
        $rootScope = _$rootScope_;
      });
    });

    it('should exist', function(){
      expect(sut).to.exist;
    });

    describe('Adding a new Group Permission', function(){
      var newResource;
      beforeEach(function(){
        sut.add('resistance');
        newResource = {resource:{uuid: '1234'}};
        permissionsService.add.resolve(newResource);
        sut.createSourceAndTargetGroups = sinon.spy();
        $rootScope.$apply();
      });

      it('should create a new Group Resource', function(){
        expect(permissionsService.add).to.have.been.calledWith('resistance');
      });

      it('should add a target group', function(){
        expect(sut.createSourceAndTargetGroups).to.have.been.calledWith(newResource);
      });
    });

  describe("#createSourceAndTargetGroups", function() {
    var targetGroup, sourceGroup, resourcePermission, updateRequest, promise;
    beforeEach(function(){
      resourcePermission = {resource: {uuid: '1234' }};
      targetGroup = {name: '1234_targets'};
      sourceGroup = {name: '1234_sources'};
      updateRequest =  {
        resourcePermission: resourcePermission,
        targetGroup: targetGroup,
        sourceGroup: sourceGroup
      };
      promise = sut.createSourceAndTargetGroups(resourcePermission);
      $rootScope.$apply();
    });

    it('Should call the PermissionsService.update()', function(){
      expect(permissionsService.update).to.have.been.called;
    });

  });

  var FakePermissionsService = function(){
    var self = this;
    self.add = sinon.spy(function() {
      var deferred = $q.defer();
      self.add.resolve = deferred.resolve;
      return deferred.promise;
    });


    self.update = sinon.spy(function(){
      var deferred = $q.defer();
      self.update.resolve = deferred.resolve;
      return deferred.promise;
    });

    self.add.resolve = function(){};
    self.update.resolve = function(){};
  };

    var FakeGroupService = function(){
      var self = this;
      self.addGroup = function(name){
        return { name : name };
      }
    };
  });

