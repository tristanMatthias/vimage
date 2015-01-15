(function() {
    angular
        .module("app")
        .controller("ImagesListCtrl", ImagesListCtrl)
        .factory('Image', ImageFactory);

    function ImageFactory($resource, $http, $upload) {
        var r = $resource("/api/v1/image/:id", {}, {
            save: {
                transformRequest: function(data) {
                    console.log($param);
                }
            }
        });

        return r;
    }

    function ImagesListCtrl($scope, Image, $filter){
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
    }
})();