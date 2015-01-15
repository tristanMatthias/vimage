/**
 * Users endpoint
 * /api/vx/user
 *
 * Functions for adding, removing, updating and listing users
 *
 * Functions
 *     GET      /api/vx/user                    Gets a list of all users
 *     GET      /api/vx/user/:id                Get a specific users details
 *     POST     /api/vx/user                    Create a new user
 *     DELETE   /api/vx/user/:id                Deletes a specific user
 *     PUT      /api/vx/user/:id                Updates a specific user
 *     POST     /api/vx/user/password/reset     Sends a password reset email
 *     GET      /password-reset/:token          Public link for posting password update
 *     POST     /api/vx/user/password/update    Updates the password
 *     POST     /login                          Logs a user in
 *     GET      /logout                         Logs a user out
 */


var e             = require(__APPROOT__ + "/app/lib/errors");
var email         = require(__APPROOT__ + "/app/lib/email");
var db            = require("mongoose");
var User          = db.model("User");
var PasswordReset = db.model("PasswordReset");
var passwordHash  = require("password-hash");
var crypto        = require("crypto");

require("colors")

var auth  = __AUTH__;
var admin = __ADMIN__;


module.exports = function(path, app) {    
    // Lists all the users
    app.get(path, auth, function(req, res, next) {
        User.find({disabled: false}, 
            "_id name email permission", 
            send(req, res, next)
        );
    });


    // List specific user
    app.get(path+":id", auth, function(req, res, next) {
        User.find(
            {_id:req.params.id, disabled: false}, 
            "_id name email permission", 
            send(req, res, next)
        );
    });


    // Adds a new user
    app.post(path, function(req, res, next) {

        if (!req.body.name)     return next(new e.ServerError("Please provide a name",    422, "name"));
        if (!req.body.email)    return next(new e.ServerError("Please provide an email",  422, "email"));
        if (!req.body.password) return next(new e.ServerError("Please provide a password",422, "password"));

        // Check if user with that email exists...
        User.find({email: req.body.email, disabled: false}, function(err, results) {
            // If they do, throw error
            if (results.length) return next(new e.ServerError("This email is already in use", 409, "email"));
            // Otherwise create a new user
            req.body.password = passwordHash.generate(req.body.password);
            var c = new User(req.body).save(send(req, res, next, true));

            email(req.body.email, "Welcome to Vimage!", {
                name: req.body.name
            }, "welcome");
        });
    });


    // Removes a user
    app.delete(path+":id", auth, function(req, res, next) {
        User.findOneAndUpdate(
            {_id: req.params.id}, 
            {disabled: true}, 
            send(req, res, next, true)
        );
    });


    // Update a user
    app.put(path+":id", auth, admin, function(req, res, next) {
        User.findOneAndUpdate(
            {_id: req.params.id}, 
            req.body,
            function(err, result) {
                res.send(result);
            }
        );
    });


    // Request email reset
    app.post(path+"password/reset", function(req, res, next) {
        // Check that user exists
        User.findOne({email: req.body.email}, function(err, user) {
            // Return error if not
            if (!user) return next(new e.ServerError("User does not exist", 422, "name"));

            // Generate token
            crypto.randomBytes(48, function(ex, buf) {
                var token = buf.toString('hex');

                var reset = new PasswordReset({
                    uid: user._id,
                    token: token
                });

                // Add to database
                reset.save(send(req, res, next));

                // Email user
                email(user.email, "Password reset", {
                    link: "http://localhost:3000/password-reset/" + token
                }, "passwordReset");

            });
        })
    });

    // Change password screen
    app.get("/password-reset/:token", function(req, res, next) {
        // Check that token exists
        PasswordReset.findOne({token: req.params.token}, function(err, reset) {
            var token = (reset) ? req.params.token : false;
            res.render("passwordUpdate", {
                token: req.params.token
            });
        });
    });


    // Update password endpoint
    app.post(path+"password/update/:token", function(req, res, next) {
        // Check that token exists
        PasswordReset.findOne({token: req.params.token}, function(err, reset) {
            if (reset) {
                var uid = reset.uid;
                User.findOneAndUpdate(
                    { _id: reset.uid }, 
                    { password: passwordHash.generate(req.body.password) },
                    function(err, user) {
                        // reset.remove();
                    }
                );

                
            } else {
                res.send("NO");
            }
        });
    });


    // Logs a user in
    app.post("/login", auth, function(req, res, next) {
        res.format({
            json: function() {
                res.json({message: "ok"});
            },
            html: function() {
                res.redirect("/");
            }
        });
    });


    // Logs a user out
    app.get("/logout", auth, function(req, res, next) {
        req.logout();
        delete req.session.user;
        res.redirect("/");
    });
}


function send(req, res, next, statusOnly) {
    if (!statusOnly) {
        return function(err, result) {
            if (err) return next(err);
            return res.json(result);
        }
    } else {
        return function(err, result) {
            if (err) return next(err);
            return res.json({status: "ok"});
        }
    }
}