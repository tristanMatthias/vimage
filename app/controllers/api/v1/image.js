var e      = require(__APPROOT__ + "/app/lib/errors");
var db     = require("mongoose");
var Image  = db.model("Image");
var auth   = __AUTH__;
var upload = __UPLOAD__;

module.exports = function(path, app) {    

    /**
     * Images endpoint
     * /api/v1/image
     *
     * Images in the vumage app
     *
     * Functions
     *     add: Add a new image
     *     list: List all of the images in the app
     */

    // Get list or specific image
    app.get(path, auth, function(req, res) {
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

    // Add a new image
    app.post(
        path, 
        auth,
        upload, 
        function(req, res, next) {
            // TODO: Stop image upload if no name
            if (!req.body.name)    return next(new e.ServerError("Please provide a name", 422, "name"));
            if (!req.files) return next(new e.ServerError("Please provide a image", 422, "image"));


            var i     = req.body;
            i.url     = req.files.file.path;
            i.creator = req.session.user._id;

            var c = new Image(i).save(function(err, image, count) {
                if (err) return next(err);
                res.send(image);
            });
        }
    );
    
    app.delete(path+":id", auth, function(req, res) {
        Image.remove({_id: req.params.id}, function(err, image, count) {
            if (err) return next(err);
            res.send({status: "ok"});
        });
    });
}