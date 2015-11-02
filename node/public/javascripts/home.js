/**
 * Created by Ricsard on 2015. 11. 02..
 */
var app = angular.module('szakdolgozat');
app.controller('HomeCtrl', function($scope, $http, $window, $mdDialog, $mdToast){

    $scope.sounds = [];
    getSounds();

    function getSounds() {
        $http.get('/sound')
            .success(function(data) {
                console.log(data);
                $scope.sounds = data;
            })
            .error(function(err) {
                console.log(err);
            })
    }

    $scope.getSound = function (sound) {
        $http.get('/sound/file/' + sound._id)
            .success(function(data) {
                console.log(data);
            })
            .error(function(err) {
                console.log(err);
            })
    };

    $scope.uploadAudio = function () {
        $mdDialog.show({
            //parent: parentEl,
            //targetEvent: $event,
            clickOutsideToClose: true,
            templateUrl: './uploadDialog.html',
            //locals: {
            //    items: $scope.items
            //},
            controller: 'UploadDialogController'
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
    
    $scope.logout = function() {
        console.log("LOGOUT");
        $http.get('/signout')
            .success(function(data) {
                console.log(data);
                $window.location.href = data.page;
            })
            .error(function(err) {
                console.log(err);
            })
    };

});