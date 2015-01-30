var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

module.exports = function(name) {
    var schema = new mongoose.Schema({
        image_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
        comments: [ 
            {
                content: String,
                date: Date,
                _creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                commentType: { type: String, default: "chat" }
            }
        ]
    });

    return schema;
}