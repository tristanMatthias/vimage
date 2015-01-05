var recursive = require('recursive-readdir');
var path      = require('path');

// Load all of the views
module.exports = function(app, cb) {
    // Loop recursively over the views directory
    recursive("app/views/", function(err, files) {
        if (err) throw err;

        files.forEach(function(fpath) {
            var file  = fpath.split("/").slice(2).join("/");
            var split = file.split(".").slice(0,-1);
            var url = "/" + split[0];

            // Detect if it is an index, and route it to the base folder
            var dir = split[0].split("/");
            if (dir.slice(-1)[0] === "index") {
                url = "/" + dir.slice(0,-1).join("/") + "/";
            }


            if ((split.length > 1) && (split.pop() === "private")){
                app.get(url, __AUTH__, render);
            } else {
                app.get(url, render);
            }

            // For each file, add the rendering function);
            function render(req, res) {
                if (req.session.user) delete req.session.user.password;

                res.render(file, {
                    flash: req.flash(),
                    user: JSON.stringify(req.session.user)
                })
            }
        });

        cb();
    });
}