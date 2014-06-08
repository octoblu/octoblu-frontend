angular.module('octobluApp').
    service('PermissionService' , function($resource){
        return $resource(
            '/api/permissions/:uuid',
            {

                uuid : '@uuid'
            },
            {
                'all': {
                    method: 'GET',
                    url: '/api/permissions',
                    isArray: true,
                    headers: {
                        'ob_skynetuuid': '@ownerUUID',
                        'ob_skynettoken': '@ownerToken'
                    }
                },
                'update': {
                    method: 'PUT',
                    isArray: false,
                    headers: {
                        'ob_skynetuuid': '@ownerUUID',
                        'ob_skynettoken': '@ownerToken'
                    }

                },
                'getGroupResourcePermission': {
                    method: 'PUT',
                    url: '/api/group/:uuid/permissions',
                    isArray: false,
                    headers: {
                        'ob_skynetuuid': '@ownerUUID',
                        'ob_skynettoken': '@ownerToken'
                    }

                },
                'remove': {
                    'method': 'DELETE',
                    isArray: false,
                    headers: {
                        'ob_skynetuuid': '@ownerUUID',
                        'ob_skynettoken': '@ownerToken'
                    }
                }
            }
        );

    });
