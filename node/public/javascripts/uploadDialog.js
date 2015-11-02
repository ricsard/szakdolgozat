/**
 * Created by Ricsard on 2015. 11. 02..
 */
var app = angular.module('szakdolgozat');
app.controller('UploadDialogController', function($scope, $http, Upload, $mdDialog){

    $scope.upload = function () {
        console.log('Upload');
        console.log($scope.file);

        Upload.upload({
            url: '/sound/upload',
            method: 'POST',
            data: {name: $scope.filename},
            file: $scope.file
        }).then(function (resp) {
            console.log('Sound upload successful');
            console.log(resp);
            $mdDialog.hide('OK');
        }, function (resp) {
            console.log('Error status: ' + resp.status);
            $mdDialog.cancel();
        }, function (evt) {
            $scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + $scope.uploadProgress + '% ');
        });
    };
});