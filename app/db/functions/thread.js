var Thread = require("mongoose").model("Thread");
var User   = require("mongoose").model("User");


// List all threads
module.exports.list = function(cb) {
    Thread.find({}, cb);
}


// List specific thread
module.exports.find = function(id, cb) {
    Thread.findOne({image_id: id}, cb);
}


// Adds a new thread
module.exports.add = function(id, data, cb) {
    // Check if thread on that image exists...
    Thread.find({image_id: id}, function(err, results) {
        console.log(id);
        // If it does, throw error
        if (results.length) return cb(new Error("A thread on that image already exists"));
        // Otherwise create a new thread
        var c = new Thread(data).save(cb);
    });
}


// Removes a thread
module.exports.remove = function(id, cb) {
    Thread.remove({image_id: id}, cb);
}


// Adds a new comment to the thread
module.exports.comment = function(id, comment, cb) {
    comment.date = new Date();

    // Check if thread exists
    module.exports.find(id, function(err, results) {
        // If the thread already exists, then comment
        if (err) cb(err);
        if (results) {
            Thread.update({image_id: id}, {$push: {"comments": comment}}, cb);
        // If it  doesn't exist, then create it with comment
        } else {
            module.exports.add(id, {
                image_id: id,
                comments: [comment]
            }, cb)
        }


    })
}