var mongoose = require('mongoose'),
    jasmine = require('jasmine-core'),
    User = mongoose.model('User'),
    _ = require('lodash'),
    rest = require('rest'),
    when = require('when'),
    mime = require('rest/interceptor/mime'),
    errorCode = require('rest/interceptor/errorCode'),
    callbacks = require('when/callbacks'),
    client = rest.wrap(mime).wrap(errorCode);

xdescribe("Create Default Group", function() {
    beforeEach(function(done){

    });

    xit("should fail if no name has been specified", function() {
//        expect(true).toBe(true);
    });

    xit("should not create a new default group if the user is unauthorized", function() {
//        expect(true).toBe(true);
    });

    xit("should create a default group, a resource permission and 2 permissions groups[source and target].", function(){

    });

    afterEach(function(done){

    });
});

xdescribe("Delete Group", function() {
    xit("should return an error if the user does NOT own the Group", function() {
//        expect(true).toBe(true);
    });

    xit("should return an error if the UUID is invalid", function() {
//        expect(true).toBe(true);
    });

    xit("should delete the group if the user owns the group and the UUID is valid", function() {
//        expect(true).toBe(true);
    });

    xit("if the group is a default group and is owned by the user, the child permission groups (source and target) should be deleted too", function(){

    });

    xit("it should return an error for an invalid user", function(){

    });
});

xdescribe("Update Group", function() {
    xit("should not allow the Group owner to be changed", function() {
//        expect(true).toBe(true);
    });

    xit("should return an error if the user does NOT own the Group", function() {
    });

    xit("should return an error if the UUID is invalid", function() {
    });

    xit("should update the  if the user owns the group and the UUID is valid", function() {
    });

    xit("should not update the name if the group is a permissions group", function(){

    });

    xit("it should return an error for an invalid user", function(){

    });


});

