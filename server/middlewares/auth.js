require('dotenv').config()
const Articles = require('../models/article')
const User = require('../models/user')
const Comments = require('../models/comment')
const jwt = require('jsonwebtoken')

module.exports = {
    isLogin: function(req, res, next){             
        let token = req.headers.token                
        if(token){
            let user = jwt.verify(req.headers.token, process.env.JWT_SECRET)
            if(user){
                User.findOne({
                    email: user.email
                })
                .populate('articles')
                .populate('comments')
                .populate('subscriber')
                .select('_id name email articles comments subscribe subscriber')
                .exec()
                .then((result) => {                    
                    if(result){                    
                        req.decoded = result                                                
                        next()
                    } else {
                        res.status(400).json({msg: 'akses ditolak! login dulu yah'})
                    }
                })
                .catch((err) => {
                    res.status(400).json({err: err})
                });
            } else {
                res.status(400).json({msg: 'akses ditolak! login dulu yah!'})   
            }
        }
    },
    isSelf: function(req, res, next){       
        Articles.findOne({
            _id: req.params.id
        })
        .then((result) => {
            if(String(result.author) === String(req.decoded._id)){
                next()
            } else {
                res.status(400).json({msg: "akses ditolak", err: err})
            }
        }).catch((err) => {
            res.status(500).json(err)
        });
    },
    isSelfComment: function(req, res, next){                
        Comments.findOne({
            _id: req.body.idComent
        })
        .then((result) => {            
            if(String(result.user) === String(req.decoded._id)){                
                next()
            } else {
                res.status(400).json({msg: 'akses ditolak', err: err})
            }
        }).catch((err) => {
            res.status(500).json({msg: 'akses ditolak', err: err})            
        });
    }
}