var app = angular.module("app");

app.controller("ImageNewCtrl", function($scope, Image, $upload, $location) {
    $scope.name = "";
    $scope.url = "";
    $scope.user = user;
    $scope.image = [];
    $scope.addImage = function() {
        if ($scope.image.length) { 
            $upload.upload({
                data: {
                    name: $scope.name
                },
                url: "/api/v1/image",
                file: $scope.image[0]
            }).success(function(image) {
                $location.path("/images/" + image._id);
                // TODO: Success link
            }).error(function(data) {
                // TODO: Handle error
            });
        }
    }
    $scope.onFileSelect = function(files) {
        
    }
});