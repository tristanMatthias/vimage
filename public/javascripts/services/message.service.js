( function() {
    angular
        .module( "app.core" )
        .service( 'MessageService', MessageService );

    function MessageService( $http, UserFactory ) {
        var self = this;
        this.socket = io();
        this.factory = {
            init: init,
            new: _new,
            messages: []
        };

        this.socket.on( "chat message", _addMessage );

        function init( imageID ) {
            self.socket.emit( "reset" );
            self.socket.emit( "join", imageID );
            self.room = imageID;

            // Load the existing comments
            $http.get( "/api/v1/thread/" + imageID ).success( function( data ) {
                if ( data ) {
                    data.comments.forEach( function( message ) {
                        _addMessage( message )
                    } );
                }
            } );
        }


        function _new( content, settings ) {
            var message = {
                _creator: user._id,
                content: content,
                commentType: "chat",
                date: new Date()
            };
            angular.extend( message, settings );


            console.log( message );

            self.socket.emit( "chat message", self.room, message );
            _addMessage( message );
        }

        function _addMessage( message ) {
            if ( typeof message._creator === "string" ) {
                UserFactory.get( { id: message._creator } ).$promise.then( function( _user ) {
                    message._creator = _user;
                } );
            }
            self.factory.messages.push( message );
        }


        return this.factory;
    }

} )();