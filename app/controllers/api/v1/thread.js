var db = require("mongoose");
var Thread = db.model("Thread");
var dbfunc = require("./../../../db/functions/thread");

var auth = __AUTH__;

module.exports = function(path, app) {    
    /**
     * Threads endpoint
     * /api/v1/thread
     *
     * Functions for adding, removing, updating and listing threads
     *
     */



    // List all threads
    app.get(path, /*auth,*/ function(req, res, next) {
        dbfunc.list(send(req, res, next));
    });


    // List specific thread
    app.get(path+":image_id", /*auth,*/ function(req, res, next) {
        dbfunc.find(req.params.image_id, send(req, res, next));
    });


    // Adds a new thread
    app.post(path, /*auth,*/ function(req, res, next) {
        dbfunc.add(req.body.image_id, req.body, send(req, res, next));
    });


    // Adds a new comment to the thread
    app.post(path+":image_id", /*auth,*/ function(req, res, next) {
        dbfunc.comment(req.params.image_id, req.body, send(req, res, next));
    });


    // Removes a thread
    app.delete(path+":image_id", /*auth,*/ function(req, res, next) {
        dbfunc.remove(req.params.image_id, send(req, res, next, true));
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


