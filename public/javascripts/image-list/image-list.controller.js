( function() {
    angular
        .module( "app.image-list" )
        .controller( "ImagesListController", ImagesListController )

    function ImagesListController( $scope, ImageFactory, $filter ) {
        $scope.images = ImageFactory.query();
        
        $scope.delete = function( id ) {
            ImageFactory.delete( {id:id}, function( e ) {
                console.log( $scope.images.length )
                $scope.images = $scope.images.filter( function( image ) {
                    return image._id != id;
                } )
                console.log( $scope.images.length )
                
            } )
        }
    }

} )();