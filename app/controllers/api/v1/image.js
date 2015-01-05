var db = require("mongoose");
var Image = db.model("Image");
var auth = __AUTH__;
module.exports = function(path, app) {    

    /**
     * Images endpoint
     * /api/v1/image
     *
     * Images in the vimage app
     *
     * Functions
     *     add: Add a new image
     *     list: List all of the images in the app
     */

    app.get(path, function(req, res) {
        // Searching for specific image
        if (req.query._id) {
            Image.findById(req.query._id, cb);
        // Searching for all images
        } else {
            Image.find(cb);
        }
        function cb(err, results) {
            res.json(results);
        }
    });

    app.post(path, auth, function(req, res) {
        req.body.creator = req.session.user._id;
        var c = new Image(req.body).save(function(err, image, count) {
            if (err) return next(err);
            res.send({status: "ok"});
        });
    });
    app.delete(path+":id", auth, function(req, res) {
        console.log("\n\n\n\nDeleting image");
        Image.remove({_id: req.params.id}, function(err, image, count) {
            if (err) return next(err);
            res.send({status: "ok"});
        });
    });
}