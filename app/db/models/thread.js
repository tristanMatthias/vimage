var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

module.exports = function(name) {
    var schema = new mongoose.Schema({
        image_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Image'},
            comments: [{
            content: String,
            date: Date,
            user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        }]
    });

    return schema;
}