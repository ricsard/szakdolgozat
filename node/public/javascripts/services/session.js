/**
 * Created by Ricsard on 2015. 11. 02..
 */
var app = angular.module('szakdolgozat');
app.service('SessionService', function(User){

    var service = {};

    service.put = function(user) {
        sessionStorage.user = JSON.stringify(user);
    };

    service.getSignedInUser = function() {
        var data = JSON.parse(sessionStorage.user);
        return new User(data._id, data.firstName, data.lastName, data.username,
            data.password, data.gender, data.role, data.doctors);
    };

    service.getSignedInUserId = function() {
        return service.getSignedInUser().userId;
    };

    service.removeSignedInUser = function() {
        delete sessionStorage.user;
    };

    return service;

});