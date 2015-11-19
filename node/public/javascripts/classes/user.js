/**
 * Created by Ricsard on 2015. 11. 02..
 */
var app = angular.module('szakdolgozat');
app.factory( "User", function() {
    // Define the constructor function.
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

    /*
     Define the "instance" methods using the prototype
     and standard prototypal inheritance.
     */
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

    /*
     Define the "class" / "static" methods. These are
     utility methods on the class itself; they do not
     have access to the "this" reference.
     */
    User.noop = function() {};

    /*
     Return constructor - this is what defines the actual
     injectable in the DI framework.
     */
    return( User );

});
