( function() {
    angular
        .module( "app.core" )
        .factory( "ImageFactory", ImageFactory );

    function ImageFactory( $resource, $http, $upload ) {
        var r = $resource( "/api/v1/image/:id", {}, {
            save: {
                transformRequest: function( data ) {
                    console.log( $param );
                }
            }
        } );

        return r;
    }

} )();