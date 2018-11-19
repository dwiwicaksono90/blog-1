const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');
const Article = require('./article')

const commentSchema = new Schema({
    comment:{
        type: String,
        required: [true, 'Komen Harus Diisi']
    },
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
},{
    timestamps: true
});

// commentSchema.pre('remove', function(next) {
//     Article.update({ _id: this._id }, { "$pull": { "comments": this._id }},function(err, obj) {
//         next();
//     });
// });

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;