var app = angular.module("signup", []);


app.controller('signupCtrl', function($scope, $http, $location) {
    console.log();
    function getData() {
        return {
            name:     $scope.name,
            email:    $scope.email,
            password: $scope.password
        }
    }
    $scope.submit = function() {
        $http.post("/api/v1/user", getData()).success(function() {
            $scope.signup.email.$setValidity("used", true);
            $scope.error = "";
            login();
        }).error(function(err) {
            $scope.signup[err.field].$setValidity("used", false);
            $scope.error = err.message;
        })
        return false;
    }
    function login() {
        $http.post("/login", getData()).success(function() {
            window.location = "/app";
        });
    }
})