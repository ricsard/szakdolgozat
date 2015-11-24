/**
 * Created by Ricsard on 2015. 11. 02..
 */
var app = angular.module('szakdolgozat');
app.controller('MyPatientsCtrl', function($scope, $http, $window, SessionService, User){

    $scope.search = {};
    $scope.myPatients = [];
    $scope.signedInUser = SessionService.getSignedInUser();
    $scope.search = {text: ''};

    getMyPatients();

    /**
     * Download and update the model with the patients of he signed in user
     */
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

    /**
     * Opens the profile page of the user with @id
     * @param {String} id
     */
    $scope.openProfilePage = function (id) {
        $window.location.href = '/user/' + id;
    };

    /**
     * Filter function for angularFilter.
     * Use the firstName and lastName of the user for filtering.
     * @param {User} user
     * @returns {boolean}
     */
    $scope.userFilter = function (user) {
        if($scope.search.text == '') {
            return true;
        } else {
            return (user.firstName.toUpperCase().indexOf($scope.search.text.toUpperCase()) > -1 ||
                    user.lastName.toUpperCase().indexOf($scope.search.text.toUpperCase()) > -1);
        }
    };

});