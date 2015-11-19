/**
 * Created by Ricsard on 2015. 11. 02..
 */
var app = angular.module('szakdolgozat');
app.controller('RegisterPatientCtrl', function($scope, $http, $window, SessionService, $mdToast){

    $scope.patient = {};
    $scope.patient.gender = 'female';

    $scope.registerPatient = function() {
        console.log("REGISTER PATIENT");
        console.log($scope.patient);

        $scope.patient.role = 'patient';
        $scope.patient.doctors = [];
        $scope.patient.doctors.push(SessionService.getSignedInUserId());
        $http.post('/signup/patient', $scope.patient)
            .success(function(data) {
                $mdToast.show($mdToast.simple().content('SUCCESS'));
                console.log(data);
            })
            .error(function(err) {
                $mdToast.show($mdToast.simple().content('FAILED'));
                console.log(err);
            })
    };

    $scope.genderOnChange = function (it) {
        if(it) {
            $scope.patient.gender = 'male';
        } else {
            $scope.patient.gender = 'female';
        }
    };

});