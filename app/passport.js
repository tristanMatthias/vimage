var e = require( __APPROOT__ + "/app/lib/errors" );

module.exports = function( done ) {
    var passport      = require( "passport"                );
    var LocalStrategy = require( "passport-local"          );
    var User          = require( "mongoose" ).model( "User" );
    var passwordHash  = require( "password-hash"           );


    passport.use( new LocalStrategy({
            usernameField: 'email',
        }, function( email, password, done ) {
            User.findOne({email : email}, function( err, user ) {
                if ( err )   return done( err );
                if ( !user ) return done( null, false, {
                    message: "Incorrect username", 
                    field: "email"
                });
                if ( !passwordHash.verify( password, user.password ) ) {
                    return done( null, false, {
                        message: "Incorrect password", 
                        field: "password"
                    });
                }
                done( null, user );
            })
        }
    ) );


    passport.serializeUser( function( user, done ) {
        done( null, user.id );
    });


    passport.deserializeUser( function( id, done ) {
        User.findById( id, function( err, user ) {
            done( err, user );
        });
    });


    global.__AUTH__ = function( req, res, next ) {
        passport.authenticate('local', function( err, user, info ) {
            if ( err ) { return next( err ) }

            // Could not login
            if ( !user && !req.session.user ) {
                return res.format({
                    json: function() {
                        return next( new e.ServerError( info.message, 403, info.field ) ); 
                    },
                    html: function() {
                        if ( info ) {
                            req.flash( "error", info.message );
                            req.flash( "email", req.body.email );
                        }
                        res.redirect( "/login" );
                    }
                });
            }

            // If user exists, then login
            if ( user ) req.session.user = user;
            return next();
            
        })( req, res, next );
    }


    global.__ADMIN__ = function( req, res, next ) {
        // Not logged in
        if ( !req.session.user ) { 
            return next( new e.ServerError( "Please login", 403 ) ); 
        }
        if ( req.session.user.permission < __ADMIN_PERMISSION__ ) { 
            return next( new e.ServerError( "You do not have access to this page", 403 ) ); 
        }
        next();
    } 


    done();
}