/**
 * Created by Ricsard on 2015. 11. 02..
 */
var app = angular.module('szakdolgozat');
app.controller('InspectionPageCtrl', function($scope, $http, $window, SessionService, User, $mdToast, Inspection){

    $scope.inspectionId = document.getElementById('inspectionId').value;
    $scope.inspection = {};
    $scope.signedInUser = SessionService.getSignedInUser();

    getActualInspection();

    /**
     * Get the actual inspection
     */
    function getActualInspection() {
        $http.get('/inspection/data/' + $scope.inspectionId)
            .success(function(data) {
                console.log(data);
                $scope.inspection = new Inspection(data._id, data.userId, data.name, data.diagnosis, data.treatment,
                    data.comment, data.sounds, data.attachments, data.doctors);
                console.log($scope.inspection);
            })
            .error(function(err) {
                console.log(err);
            });
    }

    /**
     * Update the actual inspection
     */
    $scope.updateInspection = function () {
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

});