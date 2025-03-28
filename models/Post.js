const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    image: {type: String, required: true},
    caption: {type: String},
    likes:[{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    comments: [{
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        text: String,
        createdAt: {type: Date, default: Date.now}
    }],
    createdAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Post', PostSchema);