const User = require('../models/user')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config()
    
module.exports = {
    add: (req, res) => {  
        User.findOne({
            email: req.body.email
        })
        .then((result) => {
            if(result){
                res.status(400).json({message: 'Email Sudah Digunakan'})
            } else {
                User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })
                .then((result) => {
                    res.status(201).json({msg: 'Register User Berhasil', data: result})
                }).catch((err) => {
                    res.status(500).json(err)
                });
            }
        })
        .catch((err) => {
            res.status(500).json(err)
        });
    },
    login: (req, res) => {
        User.findOne({
            email: req.body.email
        })
        .then((result) => {    
            if (!result){
                res.status(400).json({status:false, msg: "email atau password salah"})
            } else {
                let password = bcrypt.compareSync(req.body.password, result.password)                
                if(password){
                    let token = jwt.sign({
                        id: result._id,
                        email: result.email
                    }, process.env.JWT_SECRET)                    
                    res.status(200).json({token: token, msg: 'Login berhasil'})
                } else {
                    res.status(400).json({msg: "password salah"})
                }
            }
        })
        .catch(err => {
            res.status(500).json({msg: 'gagal login', err: err})
        });
    },
    getUser: (req, res) => {
        res.status(200).json(req.decoded)
    },
    subscribe: (req, res) => {
        User.updateOne({
            _id: req.decoded._id
        }, {
            $push: {
                subscribe: req.body.idAuthor
            }
        })
        .then((result) => {
            User.updateOne({
                _id: req.body.idAuthor
            }, {
                $push: {
                    subscriber: req.decoded._id
                }
            })
            .then((result2) => {
                res.status(200).json({msg: 'Subscribed', data: result})
            })
        }).catch((err) => {
            res.status(500).json({msg: 'subscribe failed', err: err})
        });
    },
    unSubscribe: (req, res) => {
        User.updateOne({
            _id: req.decoded._id
        }, {
            $pull: {
                subscribe: req.body.idAuthor
            }
        })
        .then((result) => {
            User.updateOne({
                _id: req.body.idAuthor
            }, {
                $pull: {
                    subscriber: req.decoded._id
                }
            })
            .then((result2) => {
                res.status(200).json({msg: 'UnSubscribed', data: result})
            })
        }).catch((err) => {
            res.status(500).json({msg: 'UnSubscribe Failed', err: err})
        });
    }
}