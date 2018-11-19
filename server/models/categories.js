const mongoose = require('mongoose')
const Schema = mongoose.Schema

var categorySchema = new Schema({
    name: {
        type: String,
        required: true
    }
}, { timestamps: true })


var Category = mongoose.model('Category', categorySchema)

module.exports = Article