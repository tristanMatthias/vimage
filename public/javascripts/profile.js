(function() {
    angular
        .module("app")
        .controller("ProfileCtrl", ProfileController);

    function ProfileController($scope, $http) {
        $scope.passwordReset = passwordReset;

        function passwordReset() {
            $http.post("/api/v1/user/password/reset", {email: user.email});
        }
    }
})();