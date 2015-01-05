var mongoose = require("mongoose");

module.exports = {
    url: String,
    name: String,
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
}