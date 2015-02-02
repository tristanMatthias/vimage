( function() {
    angular
        .module( "app", [
            "ngRoute", 
            "ngResource",
            "angularFileUpload",
            "app.core",
            "app.image-list",
            "app.image-new",
            "app.image",
            "app.messages"
        ] );
} )();