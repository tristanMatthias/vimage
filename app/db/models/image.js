var mongoose = require("mongoose");

module.exports = function(name) {
    var schema = new mongoose.Schema({
        url: String,
        name: String,
        creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    });

    return schema;
}