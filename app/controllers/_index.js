var fs      = require("fs");

module.exports = function(app, cb) {
    // Toggle the index being app if logged in, or home if not
    app.get("/", function(req, res) {
        if (req.session) {
            console.log(req.session.user, 1, 2, 3);
            if (req.session.user) return res.render("app/index.private.jade", {
                user: JSON.stringify(req.session.user)
            });
            else no();
            
        } else no();
        function no() {
            return res.render("index");
        }
    })
    
    cb();
}