const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

var isEmail = function(val) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(val);
}

var userSchema = new Schema({
    name : {
        type: String,
        required: [true, 'Nama Harus Diisi']
    },
    email : {
        type: String,
        unique: [true, 'Email Sudah Terdaftar'],
        required: [true, 'Email Harus Diisi'],
        validate: [isEmail, 'Format Email Harus Sesuai']
    },
    password : {
        type: String,
        minlength: [5, 'Password Minimal 5 Karakter'],
        required: [true, 'Password Harus Diisi']
    },
    subscribe: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    subscriber: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    articles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, { 
    timestamps: true 
})

userSchema.pre('save', function(next) {
    if(this.password){
        let salt = bcrypt.genSaltSync(10)
        this.password = bcrypt.hashSync(this.password, salt)
    }
    next()
})

var User = mongoose.model('User', userSchema)

module.exports = User