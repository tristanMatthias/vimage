var e = require(__APPROOT__ + "/app/lib/errors");
var db = require("mongoose");
var User = db.model("User");
var passwordHash = require("password-hash");
require("colors")

var auth = __AUTH__;

module.exports = function(path, app) {    
    /**
     * Users endpoint
     * /api/v1/user
     *
     * Functions for adding, removing, updating and listing users
     *
     * Functions
     *     /                  List all of the users
     *     /details/:email:   Details of a specific user
     *     /remove/:email     Removes a user            
     *     /login             Logs a user in
     *     /logout            Logs a user out
     */
    

    // Lists all the users
    app.get(path, function(req, res, next) {
        User.find({}, "_id name email", send(req, res, next));
    });


    // List specific user
    app.get(path+":id", auth, function(req, res, next) {
        User.findById(req.params.id, "_id name email", send(req, res, next));
    });


    // Adds a new user
    app.post(path, function(req, res, next) {
        console.log("\n\n\n\nI GOT HERE".red);

        if (!req.body.name)     return next(new e.ServerError("Please provide a name",    422, "name"));
        if (!req.body.email)    return next(new e.ServerError("Please provide an email",  422, "email"));
        if (!req.body.password) return next(new e.ServerError("Please provide a password",422, "password"));

        // Check if user with that email exists...
        User.find({email: req.body.email}, function(err, results) {
            // If they do, throw error
            if (results.length) return next(new e.ServerError("This email is already in use", 409, "email"));
            // Otherwise create a new user
            req.body.password = passwordHash.generate(req.body.password);
            var c = new User(req.body).save(send(req, res, next, true));
        });
    });


    // Removes a user
    app.delete(path+":id", auth, function(req, res, next) {
        User.remove({_id: req.params.id}, send(req, res, next, true));
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
        })
    });

    app.get("/logout", auth, function(req, res, next) {
        req.logout();
        delete req.session.user;
        res.redirect("/");
    });
}


function send(req, res, next, statusOnly) {
    if (!statusOnly) {
        return function(err, result) {
            console.log(result);
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