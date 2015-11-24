/**
 * Created by Ricsard on 2015. 11. 02..
 */
var app = angular.module('szakdolgozat');
app.controller('SearchUserCtrl', function($scope, $http, $window, SessionService, User){

    $scope.search = {};
    $scope.results = [];
    $scope.signedInUser = SessionService.getSignedInUser();

    /**
     * Triggers for every change of the search input field, and get the users who
     * matches to the search string
     */
    $scope.$watch('search', function() {
        if($scope.signedInUser.role === 'doctor') {
            searchRequest('patient');
        } else if($scope.signedInUser.role === 'patient') {
            searchRequest('doctor');
        }
    }, true);

    /**
     * Sends the search request with the search string and update the result
     * array with the results of the query
     * @param {String} type
     */
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

    /**
     * Open the userProfile page of the user with @id
     * @param {String} id
     */
    $scope.openProfilePage = function (id) {
        $window.location.href = '/user/' + id;
    };

});