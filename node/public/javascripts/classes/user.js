/**
 * Created by Ricsard on 2015. 11. 02..
 */
var app = angular.module('szakdolgozat');
app.factory( "User", function() {

    /**
     * Constructor
     * @param userId
     * @param firstName
     * @param lastName
     * @param username
     * @param password
     * @param gender
     * @param role
     * @param doctors
     * @constructor
     */
    function User( userId, firstName, lastName, username, password, gender, role, doctors ) {
        if(userId != undefined) {
            this.userId = userId;
            this.firstName = firstName;
            this.lastName = lastName;
            this.username = username;
            this.password = password;
            this.gender = gender;
            this.role = role;
            this.doctors = doctors;
        } else {
            this.userId = '';
            this.firstName = '';
            this.lastName = '';
            this.username = '';
            this.password = '';
            this.gender = '';
            this.role = '';
            this.doctors = [];
        }
    }

    User.prototype = {
        transformToSend: function() {
            var tmp = angular.copy(this);
            delete tmp.userId;
            return tmp;
        },
        getFullName: function() {
            return this.firstName + " " + this.lastName;
        }
    };

    User.noop = function() {};

    return( User );

});
