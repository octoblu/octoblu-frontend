angular.module('octobluApp')
    .service('userService', function ($http, elasticService) {
        this.getMessageGraph = function (uuid, from, interval, callback) {
            elasticService.searchAdvanced(
                {
                    'size': 0,
                    'query': {
                        'filtered': {
                            'filter': {
                                'query': {
                                    'bool': {
                                        'must': [
                                            {
                                                'query_string': {
                                                    'query': '(fromUuid.owner = "' + uuid + '" OR toUuid.owner = "' + uuid + '")'
                                                }
                                            },
//                                            {
//                                                'range': {
//                                                    'eventCode': {
//                                                        gte: 300,
//                                                        lt: 400
//                                                    }
//                                                }
//                                            },
                                            {
                                                'range': {
                                                    'timestamp': {
                                                        'from': from,
                                                        'to': 'now'
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    'facets': {
                        'times': {
                            'date_histogram': {
                                'field': 'timestamp',
                                'interval': interval
                            }
                        },
                        'types': {
                            'terms': {
                                'field': 'eventCode'
                            }
                        }
                    }
                },
                function (err, data) {
                    if (err) { return console.log(err); }

                    callback({
                        total: data.hits.total,
                        times: [
                            {
                                key: 'Messages',
                                values: _.map(data.facets.times.entries, function (item) {
                                    return {
                                        x: item.time,
                                        y: item.count
                                    };
                                })
                            }
                        ],
                        types: _.map(data.facets.types.terms, function (item) {
                            return {
                                label: item.term,
                                value: item.count
                            };
                        })
                    });
                }
            );
        };

        this.getUser = function (user, callback) {
            $http.get('/api/user/' + user)
                .success(function (data) {
                    callback(data);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                    callback({});
                });

        };

        this.activateNoAuthChannel = function(user, apiName, callback) {
            $http.put('/api/user/' + user + '/activate/' + apiName)
                .success(function(data) {
                    callback(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback({});
                });

        };

        this.saveConnection = function (uuid, name, key, token, custom_tokens, callback) {

            $http.put('/api/user/' + uuid+ '/channel/' + name, { key: key, token: token, custom_tokens: custom_tokens })
                .success(function (data) {
                    callback(data);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                    callback({});
                });

        };

        this.removeConnection = function (uuid, name, callback) {

            $http.delete('/api/user/' + uuid+ '/channel/' + name, {})
                .success(function (data) {
                    callback(data);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                    callback({});
                });

        };
    });

