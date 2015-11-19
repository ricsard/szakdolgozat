/**
 * Created by Ricsard on 2015. 11. 02..
 */
var app = angular.module('szakdolgozat');
app.controller('SearchUserCtrl', function($scope, $http, $window, SessionService, User, $mdToast){

    $scope.search = {};
    $scope.results = [];
    $scope.signedInUser = SessionService.getSignedInUser();

    $scope.$watch('search', function (newValue, oldValue) {
        if($scope.signedInUser.role === 'doctor') {
            searchRequest('patient');
        } else if($scope.signedInUser.role === 'patient') {
            searchRequest('doctor');
        }
    }, true);

    function searchRequest(type) {
        $http.post('/search/' + type, {search: $scope.search.text})
            .success(function(data) {
                $scope.results = _.map(data.result, function (element) {
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