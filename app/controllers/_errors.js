var fs      = require("fs");

module.exports = function(app, cb) {
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            var user = (req.session.user) ? req.session.user : undefined;

            res.status(err.status || 500);

            res.format({
                json: function() {
                    res.send(err);
                },
                html: function() {
                    res.render((user) ? "app/error" : "error", {
                        error: err,
                        user: JSON.stringify(user) || undefined
                    });
                }
            });

            
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        var user = (req.session.user) ? req.session.user : undefined;
        res.status(err.status || 500);

        res.render((user) ? "app/error" : "error", {
            message: err.message,
            error: {},
            user: user
        });
    });
    
    cb();
}