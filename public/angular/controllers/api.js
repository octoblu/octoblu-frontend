'use strict';

angular.module('octobluApp')
    .controller('apiController', function ($rootScope, $scope, $http, $injector, $location, $stateParams, $modal, $log, $state, channelService, userService) {
        $scope.skynetStatus = false;
        $scope.channel = {};
        $scope.user_channel = {};
        $scope.has_user_channel = false;
        $scope.custom_tokens = {};

        channelService.getByName($stateParams.name, function (data) {

            $scope.channel = data;
            $scope.custom_tokens = data.custom_tokens;

            for (var l = 0; l < $scope.currentUser.api.length; l++) {
                if ($scope.currentUser.api[l].name === $scope.channel.name) {
                    $scope.user_channel = $scope.currentUser.api[l];

                    if ($scope.currentUser.api[l].custom_tokens)
                        $scope.custom_tokens = $scope.currentUser.api[l].custom_tokens;
                    $scope.has_user_channel = true;
                }
            }
        });

        $scope.editCustom = function () {
            $state.go('ob.connector.advanced.channels.editor', { name: $scope.channel.name });
        };

        $scope.open = function () {

            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: function ($scope, $modalInstance) {

                    $scope.ok = function () {
                        $modalInstance.close('ok');
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                resolve: { }
            });

            modalInstance.result.then(function (response) {
                if (response === 'ok') {
                    $log.info('clicked ok');

                    userService.removeConnection($scope.skynetuuid, $scope.channel.name, function (data) {

                        $scope.has_user_channel = false;

                    });

                }
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.setDeactivate = function () {
            if ($scope.isOAuth() || $scope.isNoAuth()) {
                $scope.open();
                return;
            }

            $scope.has_user_channel = false;
        };

        $scope.isActivated = function () {
            // return false;
            return $scope.has_user_channel;
        };

        $scope.isOAuth = function () {
            if ($scope.channel && $scope.channel.auth_strategy === 'oauth') {
                return true;
            }

            return false;
        };

        $scope.isSimpleAuth = function () {
            if ($scope.channel && $scope.channel.auth_strategy === 'simple') {
                return true;
            }

            return false;
        };

        $scope.isCustomAuth = function () {
            if ($scope.channel && $scope.channel.auth_strategy === 'custom') {
                return true;
            }

            return false;

        };

        $scope.isNoAuth = function () {
            if ($scope.channel && $scope.channel.auth_strategy === 'none') {
                return true;
            }

            return false;
        };

        $scope.hideSecretField = function () {
            if (!$scope.channel) return false;
            if ($scope.channel.name === 'MusixMatch') {
                return true;
            }

            return false;
        };

        $scope.save = function () {
            if (!$scope.channel) return;

            userService.saveConnection($scope.skynetuuid, $scope.channel.name, $scope.user_channel.key,
                $scope.user_channel.token, $scope.custom_tokens,
                function (data) {
                    console.log('saved');
                    $scope.has_user_channel = true;
                });

            return;
        };

        $scope.authorize = function (channel) {
            if (channel.auth_strategy === 'none') {
                userService.activateNoAuthChannel($scope.skynetuuid, channel.name, function (data) {
                    $scope.currentUser = data;
                    $scope.has_user_channel = true;
                    return;
                });
            } else if (channel.owner || channel.useCustom) {
                var loc = '/api/auth/' + channel.name + '/custom';
                location.href = loc;
            } else {
                var loc = '/api/auth/' + channel.name;
                location.href = loc;
            }
        };

        $scope.logo_url = function () {
            if (!$scope.channel || !$scope.channel.logo) return '';

            return $scope.channel.logo;
        };
    })
    .controller('apiEditorController', function ($rootScope, $scope, $http, $injector, $location, $stateParams, 
            $modal, $log, $state, channelService, userService, currentUser) {
        $scope.skynetStatus = false;
        $scope.isEdit = false;
        $scope.isNew = false;

        $scope.channel = {
            owner: currentUser.skynetuuid,
            auth_strategy: '',
            logo: '',
            name: '',
            description: '',
            documentation: '',
            enabled: true,
            application: {
                base: '',
                resources: []
            }
        };

        $scope.setEditMode = function () {
            $scope.isEdit = true;
        };
        $scope.cancelEdit = function () {
            $scope.isEdit = false;
            if($scope.isNew) {
                // cancel new channel..
                $state.go('^');
            }
        };
        $scope.showEditResouce = function (path) {
            return $scope.editPath === path;
        };
        $scope.setEditResource = function (path) {
            $scope.editPath = path;
        };

        $scope.addResource = function () {
            if (!$scope.channel) return;
            if (!$scope.channel.application) {
                $scope.channel.application = {};
            }
            if (!$scope.channel.application.resources) {
                $scope.channel.application.resources = [];
            }
            var newResource = { httpMethod: 'none', doc: {}, authentication: {} };
            $scope.channel.application.resources.push(newResource);
            $scope.openEditResource(newResource);
        };

        $scope.save = function () {
            $scope.isEdit = false;
            // console.log($scope.channel);
            if (!$scope.channel) return;
            if(!$scope.channel.owner) $scope.channel.owner = $scope.skynetuuid;
            channelService.save($scope.channel, function (data) {
                // $log.info('completed save call............');
                if (data) {
                    $scope.channel = data;
                    $scope.isEdit = false;
                    $state.go('ob.connector.advanced.channels.editor', { name: data.name });
                }
            });
        };

        $scope.authorize = function (channel) {
            if (channel.auth_strategy === 'none') {
                userService.activateNoAuthChannel($scope.skynetuuid, channel.name, function (data) {
                    $scope.currentUser = data;
                    $scope.has_user_channel = true;
                    return;
                });
            } else if (channel.owner || channel.useCustom) {
                var loc = '/api/auth/' + channel.name + '/custom';
                location.href = loc;
            } else {
                var loc = '/api/auth/' + channel.name;
                location.href = loc;
            }
        };

        $scope.logo_url = function () {
            if (!$scope.channel || !$scope.channel.logo) return '';

            return $scope.channel.logo;
        };

        $scope.confirmDeleteResource = function (index) {
            $scope.selectedResourceIndex = index;
            var modalInstance = $modal.open({
                templateUrl: 'confirmDeleteResource.html',
                scope: $scope,
                controller: function ($modalInstance) {

                    $scope.ok = function () {
                        if ($scope.selectedResourceIndex >= $scope.channel.application.resources.length) {
                            $modalInstance.dismiss('ok');
                            return;
                        }

                        $scope.channel.application.resources.splice($scope.selectedResourceIndex, 1);
                        channelService.save($scope.channel, function (data) {
                            if (data) {
                                $modalInstance.dismiss('ok');
                            }
                        });
                        // $modalInstance.dismiss('ok');
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }
            });

            modalInstance.result.then(function (response) {
                    if (response === 'ok') {
                        $log.info('clicked ok');
                    }
                },
                function () {
                    $log.info('Modal dismissed at: ' + new Date());
                    $scope.selectedResourceIndex = null;
                });

        };

        $scope.confirmDeleteApi = function () {
            var modalInstance = $modal.open({
                templateUrl: 'confirmDeleteChannel.html',
                scope: $scope,
                controller: function ($modalInstance) {
                    $scope.ok = function () {
                        $modalInstance.close('ok');                        
                    };
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }
            });
            modalInstance.result.then(function (response) {
                    $log.info('response: '+response);
                    if (response === 'ok') {
                        $log.info('clicked ok');
                        channelService.delete($scope.channel.name, function(result){
                            if(result) {
                                $state.go('^');
                            }
                        });
                    }
                },
                function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
        };

        $scope.openEditResource = function (resource) {
            $scope.selectedResource = resource;
            $scope._backup = angular.copy(resource);
            var modalInstance = $modal.open({
                templateUrl: 'editResource.html',
                scope: $scope,
                controller: function ($modalInstance) {

                    $scope.addParam = function () {
                        if (!$scope.selectedResource.params) $scope.selectedResource.params = [];
                        $scope.selectedResource.params.push({name: '', style: '', type: 'string', value: '', required: "false"});
                    };
                    $scope.removeParam = function (index) {
                        if (!$scope.selectedResource.params) $scope.selectedResource.params = [];
                        console.log('length = ' + $scope.selectedResource.params.length);
                        //remove all null items
                        for (var l = $scope.selectedResource.params.length - 1; l >= 0; l--) {
                            console.log('index = ' + l);
                            console.log($scope.selectedResource.params[l] == null);
                            if ($scope.selectedResource.params[l] == null) $scope.selectedResource.params.splice(l, 1);
                        }
                        if (index >= $scope.selectedResource.params.length) return;
                        $scope.selectedResource.params.splice(index, 1);
                    };

                    $scope.ok = function () {
                        // $scope.channel.application.resources.push($scope.selectedResource);
                        channelService.save($scope.channel, function (data) {
                            // $log.info('completed save call............');
                            if (data) {
                                $modalInstance.dismiss('ok');
                            }
                        });

                    };

                    $scope.cancel = function () {
                        $scope.selectedResource.path = $scope._backup.path;
                        $scope.selectedResource.displayName = $scope._backup.displayName;
                        $scope.selectedResource.doc.url = $scope._backup.doc.url;
                        $scope.selectedResource.doc.t = $scope._backup.doc.t;
                        $scope.selectedResource.curl = $scope._backup.curl;
                        if ($scope._backup.authentication) {
                            $scope.selectedResource.authentication.required = $scope._backup.authentication.required;
                        }
                        $scope.selectedResource.httpMethod = $scope._backup.httpMethod;

                        $modalInstance.dismiss('cancel');
                    };

                    $scope.getSchema = function (plugin) {
                    };
                }
            });

            modalInstance.result.then(function (response) {
                    if (response === 'ok') {
                        $log.info('clicked ok');
                    } else if (response === 'cancel') {
                        $log.info('clicked cancel');
                        // resource = $scope.selectedResource;
                    }
                },
                function () {
                    $log.info('Modal dismissed at: ' + new Date());
                    resource = $scope.selectedResource;
                });
        };

//            $scope.$apply(function(){

        if ($stateParams.name == 'new') {
            $scope.isNew = true;
            $scope.channel.owner = $scope.skynetuuid;
        } else {
            channelService.getByName($stateParams.name, function (data) {
                $scope.isNew = false;
                $scope.channel = data;
            });
        }
//            });


    })
    .controller('apiResourcesController', function ($rootScope, $scope, $http, $injector, $location, $stateParams, $modal, $log, channelService, userService) {
        $scope.skynetStatus = false;
        $scope.channel = {};
        $scope.user_channel = {};
        $scope.has_user_channel = false;
        $scope.custom_tokens = {};

        channelService.getByName($stateParams.name, function (data) {

            $scope.channel = data;
            $scope.custom_tokens = data.custom_tokens;

            for (var l = 0; l < $scope.currentUser.api.length; l++) {
                if ($scope.currentUser.api[l].name === $scope.channel.name) {
                    $scope.user_channel = $scope.currentUser.api[l];

                    if ($scope.currentUser.api[l].custom_tokens)
                        $scope.custom_tokens = $scope.currentUser.api[l].custom_tokens;
                    $scope.has_user_channel = true;
                }
            }
        });

        $scope.editor = function () {

            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: function ($scope, $modalInstance) {
                    $scope.skynetStatus = false;

                    $scope.ok = function () {
                        $modalInstance.close('ok');
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                resolve: { }
            });

            modalInstance.result.then(function (response) {
                if (response === 'ok') {
                    $log.info('clicked ok');

                    userService.removeConnection($scope.skynetuuid, $scope.channel.name, function (data) {

                        $scope.has_user_channel = false;

                    });

                }
                ;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.save = function () {
            if (!$scope.channel) return;

            // userService.saveConnection($scope.skynetuuid, $scope.channel.name, $scope.key, $scope.token, $scope.custom_tokens,
            //   function(data) {
            //     console.log('saved');
            //     $scope.has_user_channel = true;
            //   });

            return;
        };

        $scope.authorize = function (channel) {
            if (channel.auth_strategy === 'none') {
                userService.activateNoAuthChannel($scope.skynetuuid, channel.name, function (data) {
                    $scope.currentUser = data;
                    $scope.has_user_channel = true;
                    return;
                });
            } else if (channel.owner || channel.useCustom) {
                var loc = '/api/auth/' + channel.name + '/custom';
                location.href = loc;
            } else {
                var loc = '/api/auth/' + channel.name;
                location.href = loc;
            }
        };

        $scope.logo_url = function () {
            if (!$scope.channel || !$scope.channel.logo) return '';

            return $scope.channel.logo;
        };
    })
    .controller('apiResourceDetailController', function ($rootScope, $scope, $http, $injector, $location, $stateParams, $modal, $log, channelService, userService) {
        $scope.skynetStatus = false;
        $scope.channel = {};
        $scope.user_channel = {};
        $scope.has_user_channel = false;
        $scope.custom_tokens = {};

        channelService.getByName($stateParams.name, function (data) {

            $scope.channel = data;
            $scope.custom_tokens = data.custom_tokens;

            for (var l = 0; l < $scope.currentUser.api.length; l++) {
                if ($scope.currentUser.api[l].name === $scope.channel.name) {
                    $scope.user_channel = $scope.currentUser.api[l];

                    if ($scope.currentUser.api[l].custom_tokens)
                        $scope.custom_tokens = $scope.currentUser.api[l].custom_tokens;
                    $scope.has_user_channel = true;
                }
            }
        });

        $scope.editor = function () {

            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: function ($scope, $modalInstance) {

                    $scope.ok = function () {
                        $modalInstance.close('ok');
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                resolve: { }
            });

            modalInstance.result.then(function (response) {
                if (response === 'ok') {
                    $log.info('clicked ok');

                    userService.removeConnection($scope.skynetuuid, $scope.channel.name, function (data) {

                        $scope.has_user_channel = false;

                    });

                }
                ;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.save = function () {
            if (!$scope.channel) return;

            // userService.saveConnection($scope.skynetuuid, $scope.channel.name, $scope.key, $scope.token, $scope.custom_tokens,
            //   function(data) {
            //     console.log('saved');
            //     $scope.has_user_channel = true;
            //   });

            return;
        };

        $scope.authorize = function (channel) {
            if (channel.auth_strategy === 'none') {
                userService.activateNoAuthChannel(channel.name, function (data) {
                    $scope.currentUser = data;
                    $scope.has_user_channel = true;
                    return;
                });
            } else if (channel.owner || channel.useCustom) {
                var loc = '/api/auth/' + channel.name + '/custom';
                location.href = loc;
            } else {
                var loc = '/api/auth/' + channel.name;
                location.href = loc;
            }
        };

        $scope.logo_url = function () {
            if (!$scope.channel || !$scope.channel.logo) return '';

            return $scope.channel.logo;
        };
    });
