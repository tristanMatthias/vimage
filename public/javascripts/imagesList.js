var app = angular.module("app");

app.controller("ImagesListCtrl", function($scope, Image, $filter){
    $scope.images = Image.query();
    $scope.delete = function(id) {
        Image.delete({id:id}, function(e) {
            // console.log($filter("filter")($scope.images, {_id:id}));
            console.log($scope.images.length)
            $scope.images = $scope.images.filter(function(image) {
                return image._id != id;
            })
            console.log($scope.images.length)
            
        })
    }
})

app.factory('Image', [
    '$resource', 
    function($resource) {
        return $resource("/api/v1/image/:id");
    }
]);