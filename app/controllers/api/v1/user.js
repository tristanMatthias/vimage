var db = require("mongoose");
var User = db.model("User");
var passwordHash = require("password-hash");


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
        // Check if user with that email exists...
        User.find({email: req.body.email}, function(err, results) {
            // If they do, throw error
            if (results.length) return next(new Error("A user with that email already exists"));
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
        res.redirect("/app");
    });

    app.get("/logout", auth, function(req, res, next) {
        req.logout();
        req.session.user = null;
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