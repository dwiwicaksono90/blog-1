const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('./user');

var articleSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Judul Harus Diisi']
    },
    author: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true
    },
    img: {
        type: String,
        required: [true, 'URL Gambar Harus Diisi']
    },
    text: {
        type: String,
        required: [true, 'Text Harus Diisi']
    },
    category: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Category'
    },
    readCount: {
        type : Number,
        default : 0
    },
    likes: [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }],
    comments: [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Comment'
    }]
}, { timestamps: true })


var Article = mongoose.model('Article', articleSchema)
articleSchema.pre('remove', function(next) {
    User.update({ _id: this.user }, {$pull: {articles: this._id}}, function(err, obj) {
        next()
    })
})

module.exports = Article