/**
 * Created by Ricsard on 2015. 11. 02..
 */
var app = angular.module('szakdolgozat');
app.controller('LoginCtrl', function($scope, $http, $window){

    $scope.loginObj = {};

    $scope.sendLogin = function() {
        console.log("LOGIN");
        console.log($scope.loginObj);

        $http.post('/login', $scope.loginObj)
            .success(function(data) {
                console.log(data);
                $window.location.href = data.page;
            })
            .error(function(err) {
                console.log(err);
            })
    };

});