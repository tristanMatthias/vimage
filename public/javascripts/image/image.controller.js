( function() {
    angular
        .module(     "app.image", []        )
        .controller( "ImageController", ImageController );

    function ImageController( $scope, $routeParams, ImageFactory, MessageService ) {
        $scope.route = $routeParams;
        $scope.image = ImageFactory.get( { _id: $routeParams.id } );
        $scope.messages = MessageService;
        $scope.messages.init( $routeParams.id );
    }

} )();