/**
 * Created by Ricsard on 2015. 11. 02..
 */
var app = angular.module('szakdolgozat');
app.controller('RegisterCtrl', function($scope, $http, $window){

    $scope.regObj = {};
    $scope.regObj.gender = 'female';
    $scope.regObj.role = 'doctor';

    $scope.sendRegister = function() {
        console.log("REG");
        console.log($scope.regObj);

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

    $scope.genderOnChange = function (it) {
        if(it) {
            $scope.regObj.gender = 'male';
        } else {
            $scope.regObj.gender = 'female';
        }
    };

    $scope.roleOnChange = function (it) {
        if(it) {
            $scope.regObj.role = 'researcher';
        } else {
            $scope.regObj.role = 'doctor';
        }
    };
});