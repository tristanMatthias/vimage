var app = angular.module("app");

app.controller("ImageCtrl",
    function($scope, $routeParams, Image) {
        $scope.route = $routeParams;
        $scope.image = Image.get({_id: $routeParams.id});
    }
)