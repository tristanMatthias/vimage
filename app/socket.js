module.exports = function( server ) {
    var comment = require( "./db/functions/thread" );
    var io = require( 'socket.io')( server );


    io.on( 'connection', function( socket ){
        socket.on( "join", function( room ) {
            console.log( room );
            socket.room = room;
            socket.join( room );
        });
        socket.on( "chat message", function( room, data ) {
            comment.comment( room, data, function( err, result ) {
                socket.broadcast.to( socket.room ).emit( "chat message", data );
            });
        });

        socket.on( "reset", function() {
            socket.leave( socket.room );
        });
        socket.on( "disconnect", function() {
            // TODO
        })

    });

}