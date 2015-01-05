var mongoose = require("mongoose");

// A thread of comments.
module.exports =  {
    image_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Image'},
    comments: [{
        content: String,
        date: Date,
        user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    }]
}