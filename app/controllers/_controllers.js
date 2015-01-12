var fs = require("fs");
var path = require("path");

var dir = "app/controllers/";

// Load all of the routes in the folder
module.exports = function(app, cb) {
    // Setup basic routes
    // fs.readdirSync(dir).forEach(function(file) {
    //     if (fs.statSync(dir + file).isDirectory()) return;

    //     var name = file.split(".")[0];
    //     if (name.indexOf("_") != 0) {
    //         require("./" + name)(name, app);
    //     }
    // });

    // Setup api
    fs.readdirSync(dir + "api").forEach(function(version) {
        var fullDir = dir + "api/" + version;
        if (fs.statSync(fullDir).isDirectory()) {
            fs.readdirSync(fullDir).forEach(function(file) {
                require(path.resolve(fullDir + "/" + file))(
                    "/api/" + version + "/" + file.split(".")[0] + "/",
                    app
                );
            });
        }
    });


    app.get("/", function(req, res) {
        if (req.session) {
            if (req.session.user) return res.render("app/index.private.jade", {
                user: JSON.stringify(req.session.user)
            });
            else no();
            
        } else no();
        function no() {
            console.log("RUNNING NO");
            return res.render("index");
        }
    })


    cb();
}


global.__AUTH__