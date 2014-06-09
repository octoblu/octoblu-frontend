angular.module('octobluApp').
    service('PermissionService' , function($resource){


        return $resource(
            '/api/permissions/:uuid',
            { uuid : '@uuid'}
             ,
            {
                getPermissionByUUID: {
                    method: 'GET',
                    url: '/api/permissions',
                    isArray: true,
                    params : {
                        uuid : '@uuid'
                    }
                },
                all: {
                    method: 'GET',
                    url: '/api/permissions',
                    isArray: true
                },
                update: {
                    method: 'PUT',
                    isArray: false,
                    params : {
                        uuid : '@uuid'
                    }
                },
                add: {
                    method: 'POST',
                    url : 'api/permissions',
                    params : {
                        uuid : '@uuid'
                    },
                    isArray: false
                },
                'getGroupResourcePermission': {
                    method: 'PUT',
                    url: '/api/group/:uuid/permissions',
                    params : {
                        uuid : '@uuid'
                    },
                    isArray: false
                },
                'remove': {
                    'method': 'DELETE',
                    params : {
                        uuid : '@uuid'
                    },
                    isArray: false
                }
            }
        );

    });
