( function() {
    angular
        .module( "app" )
        .controller( 'AppController', AppController );

    function AppController( $rootScope ) {
        // TODO: Replace with constant
        $rootScope.user = user;
    }

} )();