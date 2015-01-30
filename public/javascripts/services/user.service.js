( function() {
    angular
        .module( "app.core" )
        .factory( 'UserFactory', UserFactory );

    function UserFactory( $resource ) {
        return $resource("/api/v1/user/:id", {}, {
            save:   { method:'put',    params: {id: '@_id'} },
            delete: { method:'delete', params: {id: '@_id'} }

        });
    }

} )();