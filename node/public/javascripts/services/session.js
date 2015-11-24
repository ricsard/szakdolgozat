/**
 * Created by Ricsard on 2015. 11. 02..
 */
var app = angular.module('szakdolgozat');
app.service('SessionService', function(User){

    var service = {};

    /**
     * Put the @user to the session storage
     * @param {String} user
     */
    service.put = function(user) {
        sessionStorage.user = JSON.stringify(user);
    };

    /**
     * Get the signed in user from the session storage
     * @returns {User|*}
     */
    service.getSignedInUser = function() {
        var data = JSON.parse(sessionStorage.user);
        return new User(data._id, data.firstName, data.lastName, data.username,
            data.password, data.gender, data.role, data.doctors);
    };

    /**
     * Get the userId of the signed in user
     * @returns {*|string}
     */
    service.getSignedInUserId = function() {
        return service.getSignedInUser().userId;
    };

    /**
     * Remove the user key from session storage
     */
    service.removeSignedInUser = function() {
        delete sessionStorage.user;
    };

    return service;

});