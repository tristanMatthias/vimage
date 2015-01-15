var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

module.exports = function(name) {
    var schema = new mongoose.Schema({
        token: String,
        uid: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        createdAt: { type: Date, default: Date.now(), expires: 60*30*1000}, // Expires after 30 mins
    });

    return schema;
}