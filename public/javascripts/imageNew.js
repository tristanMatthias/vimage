var app = angular.module("app");

app.controller("ImageNewCtrl", function($scope, Image) {
    $scope.name = "";
    $scope.url = "";
    $scope.user = user;
    $scope.addImage = function() {
        var i = new Image({name: $scope.name, url: $scope.url});
        i.$save();
    }
});