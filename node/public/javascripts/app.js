/**
 * Created by Ricsard on 2015. 10. 31..
 */
//var app = angular.module('szakdolgozat', []);
var app = angular.module('szakdolgozat', ['ngFileUpload', 'ngMaterial']);
app.controller('MainCtrl', function($scope, $http, Upload){
    $scope.abc = 'abcde';
    $scope.file = {};
    $scope.uploadProgress = 0;

    $scope.uploadPic = function (file) {
        console.log("Upload file attribute is: " + file);
        console.log(file);
        console.log("The file on the scope is: " + $scope.file);
        console.log($scope.file);

        Upload.upload({
            url: '/upload',
            method: 'POST',
            file: file
        }).then(function (resp) {
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            $scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + $scope.uploadProgress + '% ');
        });
    };
});