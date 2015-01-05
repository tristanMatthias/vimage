var fs       = require("fs");
var async    = require("async");
var mongoose = require("mongoose");
var Schema   = mongoose.Schema;


module.exports = function(done) {
    fs.readdir("app/db/models", function(err, files) {
        files.forEach(function(file) {
            if (file.indexOf("index") != 0) {
                // Load the schema model, and create it
                var schema = new Schema(require("./models/"+file));
                var name = file.split(".")[0]; // Remove filename extension
                name = name.slice(0,1).toUpperCase() + name.slice(1); // Capitalize first letter in file name
                
                mongoose.model(name, schema);
            }
        });

        mongoose.connect(__DB_CONNECTION__, function(err) {
            if (err) {
                LOG_ERROR(err, true);
            } else {
                LOG_SUCCESS("Successfully connected to database", __DB_CONNECTION__);
                done();
            }
        });
    });

}