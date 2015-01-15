var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

module.exports = function(name) {
    var schema = new mongoose.Schema({
        name: String,
        email: String,
        password: String,
        permission: { type: Number, default: 0 },
        disabled: { type: Boolean, default: false }
    });

    return schema;
}