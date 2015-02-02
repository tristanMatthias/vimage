( function() {
    angular
        .module( "app" )
        .config( AppConfig )

    function AppConfig( $routeProvider ) {
        $routeProvider
            .when( "/", {
                templateUrl: "/app/view/images-list",
                controller: "ImagesListController"
            } )
            .when( "/images/:id", {
                templateUrl: "/app/view/image",
                controller: "ImageController"
            } )
            .when( "/new-image", {
                templateUrl: "/app/view/image-new",
                controller: "ImageNewController"
            } )
            .when( "/account", {
                templateUrl: "/account/profile",
                controller: "ProfileController"
            } )
            .otherwise( {
                redirectTo: "/"
            } );
    }
} )();