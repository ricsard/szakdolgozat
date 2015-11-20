/**
 * Created by Ricsard on 2015. 11. 02..
 */
var app = angular.module('szakdolgozat');
app.controller('HomeCtrl', function($scope, $http, $window, $mdDialog, $mdToast, SessionService){

    $scope.sounds = [];
    //getSounds();


    $scope.signedInUser = SessionService.getSignedInUser();
    $scope.menu = [];
    setupMenu();

    var OverrideException = {
        name: "OverrideMethodException",
        message: "Override this method"
    };

    function or() {
        throw OverrideException;
    }

    function setupMenu() {
        if($scope.signedInUser.role === 'patient') {
            $scope.menu.push({
                subheader: 'Patient menu',
                elements: [
                    {title: "Search doctor", click: openSearchUser},
                    {title: "Menu2", click: or}
                ]
            });
        } else if($scope.signedInUser.role === 'doctor') {
            $scope.menu.push({
                subheader: 'Doctor menu',
                elements: [
                    {title: "Register patient", click: openRegisterPatient},
                    {title: "Search patient", click: openSearchUser},
                    {title: "My patients", click: openMyPatients},
                    {title: "Sounds", click: openSounds}
                ]
            });
        } else if($scope.signedInUser.role === 'researcher') {
            $scope.menu.push({
                subheader: 'Researcher menu',
                elements: [
                    {title: "Menu1", click: or},
                    {title: "Menu2", click: or}
                ]
            });
        }
    }

    function openRegisterPatient() {
        $window.location.href = '/signup/patient';
    }

    function openSearchUser() {
        $window.location.href = '/search/user';
    }

    function openMyPatients() {
        $window.location.href = '/myPatients';
    }

    function openSounds() {
        $window.location.href = '/sounds';
    }

    //function getSounds() {
    //    $http.get('/sound')
    //        .success(function(data) {
    //            console.log(data);
    //            $scope.sounds = data;
    //        })
    //        .error(function(err) {
    //            console.log(err);
    //        })
    //}
    //
    //$scope.getSound = function (sound) {
    //    $http.get('/sound/file/' + sound._id)
    //        .success(function(data) {
    //            console.log(data);
    //        })
    //        .error(function(err) {
    //            console.log(err);
    //        })
    //};
    //
    //
    //
    //$scope.uploadAudio = function () {
    //    $mdDialog.show({
    //        //parent: parentEl,
    //        //targetEvent: $event,
    //        clickOutsideToClose: true,
    //        templateUrl: './uploadDialog.html',
    //        //locals: {
    //        //    items: $scope.items
    //        //},
    //        controller: 'UploadDialogController'
    //    }).then(function(answer) {
    //        $mdToast.show(
    //            $mdToast.simple()
    //                .content(answer)
    //        );
    //    }, function() {
    //        $mdToast.show(
    //            $mdToast.simple()
    //                .content('Cancelled')
    //        );
    //    });
    //};
    
    $scope.logout = function() {
        console.log("LOGOUT");
        $http.get('/signout')
            .success(function(data) {
                console.log(data);
                $window.location.href = data.page;
                SessionService.removeSignedInUser();
            })
            .error(function(err) {
                console.log(err);
            })
    };

});