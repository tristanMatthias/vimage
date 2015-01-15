(function() {
    angular
        .module("app")
        .controller("ImageNewCtrl", ImageNewCtrl);

    function ImageNewCtrl($scope, Image, $upload, $location) {
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
                }).progress(function(evt) {
                    console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file: '+ evt.config.file.name);
                }).success(function(image) {
                    $location.path("/images/" + image._id);
                    // TODO: Success link
                }).error(function(data) {
                    // TODO: Handle error
                });
            }
        }
    }

})();