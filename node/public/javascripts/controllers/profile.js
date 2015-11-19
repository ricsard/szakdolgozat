/**
 * Created by Ricsard on 2015. 11. 02..
 */
var app = angular.module('szakdolgozat');
app.controller('ProfileCtrl', function($scope, $http, $window, SessionService, User, $mdToast, $mdDialog, Inspection){

    $scope.profileUserId = document.getElementById('userId').value;
    $scope.activeTab = 'profile';
    $scope.profileUser = {};
    $scope.inspections = [];

    getActualUser();
    listInspections();

    /**
     * Sets the active tat to tab
     * @param {String} tab
     */
    $scope.changeTab = function (tab) {
        $scope.activeTab = tab;
    };

    /**
     * Open a dialog for adding a new inspection
     */
    $scope.addNewInspection = function () {
        $mdDialog.show({
            clickOutsideToClose: true,
            scope: $scope,
            templateUrl: '../../addInspectionDialog.html',
            controller: 'AddInspectionCtrl'
        }).then(function(answer) {
            $mdToast.show(
                $mdToast.simple()
                    .content(answer)
            );
        }, function() {
            $mdToast.show(
                $mdToast.simple()
                    .content('Cancelled')
            );
        });
    };

    /**
     * Get the actual user
     */
    function getActualUser() {
        $http.get('/user/data/' + $scope.profileUserId)
            .success(function(data) {
                console.log(data);
                $scope.profileUser = new User(data._id, data.firstName, data.lastName, data.username,
                    data.password, data.gender, data.role, data.doctors);
            })
            .error(function(err) {
                console.log(err);
            });
    }

    /**
     * List the inspections of a user
     */
    function listInspections() {
        $http.get('/inspection/list/' + $scope.profileUserId)
            .success(function(data) {
                console.log(data);
                $scope.inspections = _.map(data.results, function (element) {
                    return new Inspection(element._id, element.userId, element.name, element.diagnosis, element.treatment,
                        element.comment, element.sounds, element.attachments, element.doctors);
                });
            })
            .error(function(err) {
                console.log(err);
            });
    }

});