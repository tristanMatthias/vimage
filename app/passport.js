module.exports = function(done) {
    var passport      = require("passport");
    var LocalStrategy = require("passport-local");
    var User          = require("mongoose").model("User");
    var passwordHash  = require("password-hash");


    passport.use(new LocalStrategy({
            usernameField: 'email',
        }, function(email, password, done) {
            User.findOne({email : email}, function(err, user) {
                if (err)   return done(err);
                if (!user) return done(null, false, {"message": "Incorrect username"});
                if (!passwordHash.verify(password, user.password)) {
                    return done(null, false, {"message": "Incorrect password"});
                }
                done(null, user);
            })
        }
    ));


    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    global.__AUTH__ = function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (info) {
                req.flash("error", info.message);
                req.flash("email", req.body.email);
            }
            if (err) { return next(err) }
            if (!user && !req.session.user) { return res.redirect('/login') }
            if (user) req.session.user = user;
            return next();
        })(req, res, next);
    }
    done();
}