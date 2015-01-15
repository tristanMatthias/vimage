(function() {
    angular
        .module("app")
        .controller("ImageCtrl", ImageCtrl);

    function ImageCtrl($scope, $routeParams, Image) {
        $scope.route = $routeParams;
        $scope.image = Image.get({_id: $routeParams.id});
    }

})();