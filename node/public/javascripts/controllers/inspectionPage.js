/**
 * Created by Ricsard on 2015. 11. 02..
 */
var app = angular.module('szakdolgozat');
app.controller('InspectionPageCtrl', function($scope, $http, $window, SessionService, $mdToast, Inspection, Upload){

    $scope.inspectionId = document.getElementById('inspectionId').value;
    $scope.inspection = {};
    $scope.signedInUser = SessionService.getSignedInUser();
    $scope.attachments = [];
    $scope.sounds = [];

    $scope.soundFile = {};
    $scope.soundFilename = '';
    $scope.uploadedSounds = [];

    getActualInspection();

    /**
     * Get the actual inspection with the sounds and attachments
     */
    function getActualInspection() {
        $http.get('/inspection/data/' + $scope.inspectionId)
            .success(function(data) {
                console.log(data);
                $scope.inspection = new Inspection(data._id, data.userId, data.name, data.diagnosis, data.treatment,
                    data.comment, data.sounds, data.attachments, data.doctors);
                console.log($scope.inspection);
                getAttachmentsMetadata();
                getSoundsMetadata();
            })
            .error(function(err) {
                console.log(err);
            });
    }

    /**
     * Update the actual inspection
     */
    $scope.updateInspection = function () {
        // We will save only the ids of the uploaded sounds for the inspection
        _.each($scope.uploadedSounds, function(element) {
            $scope.inspection.sounds.push(element._id);
        });

        var sendObj = $scope.inspection.transformToSend();

        $http.post('/inspection/update/' + $scope.inspectionId, sendObj)
            .success(function(data) {
                $mdToast.show($mdToast.simple().content('Successful'));
                $window.location.href = '/user/' + $scope.inspection.userId;
            })
            .error(function(err) {
                console.log(err);
                $mdToast.show($mdToast.simple().content('Failed'));
            });
    };

    /**
     * Get inspection's attachments metadata
     */
    function getAttachmentsMetadata() {
        _.each($scope.inspection.attachments, function(id) {
            $http.get('/attachment/' + id)
                .success(function(data) {
                    $scope.attachments.push(data)
                })
                .error(function(err) {
                    console.log(err);
                });
        });
    }

    /**
     * Get inspection's sounds metadata
     */
    function getSoundsMetadata() {
        _.each($scope.inspection.sounds, function(id) {
            $http.get('/sound/' + id)
                .success(function(data) {
                    $scope.sounds.push(data)
                })
                .error(function(err) {
                    console.log(err);
                });
        });
    }

    /**
     * Upload the selected soundFile
     */
    $scope.uploadSound = function () {
        if($scope.soundFilename != '' && $scope.soundFilename != undefined) {
            uploadFile('/sound/upload', $scope.soundFilename, $scope.soundFile, function(resp) {
                $scope.uploadedSounds.push(resp.data);
                $scope.soundFilename = '';
                $scope.soundFile = {};
            });
        }
    };

    /**
     * Delete the selected soundFile
     * @param sound
     */
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

    /**
     * Upload file stub
     * @param {String} path
     * @param {String} fileName
     * @param {Object} file
     * @param {Function} successCallback
     */
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