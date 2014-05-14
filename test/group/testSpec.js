var _ = require('lodash'),
   mongoose = require('mongoose'),
    GroupSchema = require('/app/models/group'),
    Group = mongoose.model('Group', GroupSchema),
    UserSchema = require('/app/models/user'),
    User = mongoose.model('User'),
    rest = require('rest'),
    mime = require('rest/interceptor/mime'),
    client = rest.wrap(mime),
    uuid = require('node-uuid');


describe("Add Group", function() {


    it("should not create group with duplicate name", function(done) {
        var result;
        var clientOptions = {
            'method' : 'POST',
            'path' : '/api/user/:id/:token/groups',
            'params' : {
                'id' : '',
                'token' : ''
            },
            'entity' : {
                'name' : 'family'
            }
        };

        client.path(clientOptions).then(function(response){
            result = response;
            done();

        }, function(response){
           result = response;
            done();

        });


    });

    xit("should not create a group with no name" , function(){

    });

    xit("should create a group with a valid name" , function(){

    });

    xit("should create a group with default permissions if none are given" , function(){

    });

    xit("should create a group with permissions set to the defined permission settings" , function(){

    });

    xit("should not create a group for a user with invalid UUID and TOKEN" , function(){

    });

});

//describe("Group API - Delete", function() {});
//describe("Group API - Find", function() {});
//describe("Group API - Update", function() {});

