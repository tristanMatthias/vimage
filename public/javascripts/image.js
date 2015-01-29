( function() {
    angular
        .module(     "app"                  )
        .controller( "ImageCtrl", ImageCtrl );

    function ImageCtrl( $scope, $routeParams, Image, MessageService ) {
        $scope.route = $routeParams;
        $scope.image = Image.get( { _id: $routeParams.id } );
        $scope.messages = MessageService;
        $scope.messages.init( $routeParams.id );
    }

} )();