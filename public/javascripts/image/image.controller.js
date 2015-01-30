( function() {
    angular
        .module(     "app.image", []        )
        .controller( "ImageContoller", ImageContoller );

    function ImageContoller( $scope, $routeParams, Image, MessageService ) {
        $scope.route = $routeParams;
        $scope.image = Image.get( { _id: $routeParams.id } );
        $scope.messages = MessageService;
        $scope.messages.init( $routeParams.id );
    }

} )();