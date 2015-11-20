/**
 * Created by Ricsard on 2015. 11. 02..
 */
var app = angular.module('szakdolgozat');
app.controller('AddInspectionCtrl', function($scope, $http, $window, Upload, SessionService, $mdDialog, $mdToast, Inspection){

    $scope.inspection = new Inspection();
    console.log($scope.profileUserId);

    $scope.soundFile = {};
    $scope.soundFilename = '';
    $scope.uploadedSounds = [];

    $scope.attachmentFile = {};
    $scope.attachmentFilename = '';
    $scope.uploadedAttachments = [];

    $scope.saveInspection = function () {
        $scope.inspection.userId = $scope.profileUserId;

        _.each($scope.uploadedSounds, function(element) {
            $scope.inspection.sounds.push(element._id);
        });

        _.each($scope.uploadedAttachments, function(element) {
            $scope.inspection.attachments.push(element._id);
        });

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

    $scope.uploadSound = function () {
        if($scope.soundFilename != '' && $scope.soundFilename != undefined) {
            uploadFile('/sound/upload', $scope.soundFilename, $scope.soundFile, function(resp) {
                $scope.uploadedSounds.push(resp.data);
                $scope.soundFilename = '';
                $scope.soundFile = {};
            });
        }
    };

    $scope.deleteSound = function (sound) {
        $http.delete('/sound/delete/' + sound._id)
            .success(function(data) {
                $scope.uploadedSounds = _.reject($scope.uploadedSounds, function(element) {
                    return element._id == sound._id;
                })
            })
            .error(function(err) {
                console.log(err);
            });
    };

    $scope.uploadAttachment = function () {
        if($scope.attachmentFilename != '' && $scope.attachmentFilename != undefined) {
            uploadFile('/attachment/upload', $scope.attachmentFilename, $scope.attachmentFile, function(resp) {
                $scope.uploadedAttachments.push(resp.data);
                $scope.attachmentFilename = '';
                $scope.attachmentFile = {};
            });
        }
    };

    $scope.deleteAttachment = function (attachment) {
        $http.delete('/attachment/delete/' + attachment._id)
            .success(function(data) {
                $scope.uploadedAttachments = _.reject($scope.uploadedAttachments, function(element) {
                    return element._id == attachment._id;
                })
            })
            .error(function(err) {
                console.log(err);
            });
    };

    function uploadFile(path, fileName, file, successCallback) {
        Upload.upload({
            url: path,
            method: 'POST',
            data: {name: fileName},
            file: file
        }).then(function (resp) {
            successCallback(resp);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            $scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + $scope.uploadProgress + '% ');
        });
    }

});