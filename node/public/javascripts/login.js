/**
 * Created by Ricsard on 2015. 11. 02..
 */
var app = angular.module('szakdolgozat');
app.controller('LoginCtrl', function($scope, $http, $window, SessionService){

    $scope.loginObj = {};

    /**
     * Send login request, and it was successful redirect to the home page
     */
    $scope.sendLogin = function() {
        console.log("LOGIN");
        console.log($scope.loginObj);

        $http.post('/login', $scope.loginObj)
            .success(function(data) {
                console.log(data);
                $window.location.href = data.page;
                SessionService.put(data.user);
            })
            .error(function(err) {
                console.log(err);
            })
    };

    /**
     * Relocate to the sign up page
     */
    $scope.goToRegister = function () {
        $window.location.href = '/signup';
    };

});