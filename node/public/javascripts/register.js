/**
 * Created by Ricsard on 2015. 11. 02..
 */
var app = angular.module('szakdolgozat');
app.controller('RegisterCtrl', function($scope, $http, $window){

    $scope.regObj = {};
    $scope.regObj.gender = 'female';
    $scope.regObj.role = 'doctor';

    /**
     * Send register request and if it was successful relocate to the path
     * in the response
     */
    $scope.sendRegister = function() {
        $scope.regObj.doctors = [];
        $http.post('/signup', $scope.regObj)
            .success(function(data) {
                console.log(data);
                $window.location.href = data.page;
            })
            .error(function(err) {
                console.log(err);
            })
    };

    /**
     * Handler for gender change
     * @param {String} it
     */
    $scope.genderOnChange = function (it) {
        if(it) {
            $scope.regObj.gender = 'male';
        } else {
            $scope.regObj.gender = 'female';
        }
    };

    /**
     * Handler for role change
     * @param {String} it
     */
    $scope.roleOnChange = function (it) {
        if(it) {
            $scope.regObj.role = 'researcher';
        } else {
            $scope.regObj.role = 'doctor';
        }
    };
});