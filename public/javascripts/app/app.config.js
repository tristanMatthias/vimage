( function() {
    angular
        .module( "app" )
        .config( AppConfig )

    function AppConfig( $routeProvider ) {
        $routeProvider
            .when( "/", {
                templateUrl: "/app/view/images-list",
                controller: "ImagesListCtrl"
            } )
            .when( "/images/:id", {
                templateUrl: "/app/view/image",
                controller: "ImageCtrl"
            } )
            .when( "/new-image", {
                templateUrl: "/app/view/image-new",
                controller: "ImageNewCtrl"
            } )
            .when( "/account", {
                templateUrl: "/account/profile",
                controller: "ProfileCtrl"
            } )
            .otherwise( {
                redirectTo: "/"
            } );
    }
} )();