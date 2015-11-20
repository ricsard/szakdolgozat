/**
 * Created by Ricsard on 2015. 11. 02..
 */
var app = angular.module('szakdolgozat');
app.controller('MyPatientsCtrl', function($scope, $http, $window, SessionService, User, $mdToast){

    $scope.search = {};
    $scope.myPatients = [];
    $scope.signedInUser = SessionService.getSignedInUser();

    getMyPatients();

    function getMyPatients() {
        $http.get('/myPatients/list')
            .success(function(data) {
                $scope.myPatients = _.map(data.results, function (element) {
                    return new User(element._id, element.firstName, element.lastName, element.username,
                        element.password, element.gender, element.role, element.doctors);
                });
            })
            .error(function(err) {
                console.log(err);
            });
    }

    $scope.openProfilePage = function (id) {
        $window.location.href = '/user/' + id;
    };

});