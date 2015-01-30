(function() {
    angular
        .module("app.image-list")
        .controller("ImagesListController", ImagesListController);

    function ImagesListController($scope, Image, $filter){
        $scope.images = Image.query();
        
        $scope.delete = function(id) {
            Image.delete({id:id}, function(e) {
                console.log($scope.images.length)
                $scope.images = $scope.images.filter(function(image) {
                    return image._id != id;
                })
                console.log($scope.images.length)
                
            })
        }
    }

})();