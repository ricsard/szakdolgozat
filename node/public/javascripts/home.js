/**
 * Created by Ricsard on 2015. 11. 02..
 */
var app = angular.module('szakdolgozat');
app.controller('HomeCtrl', function($scope, $http, $window, SessionService){

    $scope.signedInUser = SessionService.getSignedInUser();
    $scope.menu = [];
    setupMenu();

    var OverrideException = {
        name: "OverrideMethodException",
        message: "Override this method"
    };

    function orM() {
        throw OverrideException;
    }

    /**
     * Set up the left side menu along the signed in user role
     */
    function setupMenu() {
        if($scope.signedInUser.role === 'patient') {
            $scope.menu.push({
                subheader: 'Patient menu',
                elements: [
                    {title: "Search doctor", click: openSearchUser},
                    {title: "Menu2", click: orM}
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
                    {title: "Menu1", click: orM},
                    {title: "Menu2", click: orM}
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

    /**
     * Logout the signed in user
     */
    $scope.logout = function() {
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