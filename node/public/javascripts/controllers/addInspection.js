/**
 * Created by Ricsard on 2015. 11. 02..
 */
var app = angular.module('szakdolgozat');
app.controller('AddInspectionCtrl', function($scope, $http, $window, Upload, SessionService, $mdDialog, $mdToast, Inspection){

    $scope.inspection = new Inspection();
    console.log($scope.profileUserId);

    $scope.attachmentFilename = '';
    $scope.uploadedAttachments = [];

    $scope.saveInspection = function () {
        $scope.inspection.userId = $scope.profileUserId;

        var sendObj = $scope.inspection.transformToSend();

        $http.post('/inspection/add', sendObj)
            .success(function(data) {
                console.log(data);
                $scope.inspections.push(new Inspection(data._id, data.userId, data.name, data.diagnosis, data.treatment,
                    data.comment, data.sounds, data.attachments, data.doctors));
                $mdDialog.hide('Done');
            })
            .error(function(err) {
                console.log(err);
                $mdDialog.hide('There was an error');
            });
    };

    $scope.uploadAttachment = function () {
        Upload.upload({
            url: '/attachment/upload',
            method: 'POST',
            data: {name: $scope.attachmentFilename},
            file: $scope.attachment
        }).then(function (resp) {
            console.log('Attachment upload successful');
            console.log(resp.data);
            $scope.uploadedAttachments.push(resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            $scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + $scope.uploadProgress + '% ');
        });
    };

});