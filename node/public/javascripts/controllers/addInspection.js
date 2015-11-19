/**
 * Created by Ricsard on 2015. 11. 02..
 */
var app = angular.module('szakdolgozat');
app.controller('AddInspectionCtrl', function($scope, $http, $window, SessionService, $mdDialog, $mdToast, Inspection){

    $scope.inspection = new Inspection();
    console.log($scope.profileUserId);

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

});