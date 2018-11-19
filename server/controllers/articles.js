const Article = require('../models/article')
const mailNotifNewArticle = require('../helpers/mailNotifNewArticle')

module.exports = {
    add: (req, res) => {
        Article.create({
            title: req.body.title,
            text: req.body.text,
            author: req.decoded._id,
            img: req.body.img
        })
        .then((result) => {
            mailNotifNewArticle(req.decoded.subscriber, req.decoded.name, result)
            res.status(201).json({msg: 'add article success', result: result})
        }).catch((err) => {
            res.status(500).json(err)
        });
    },
    find: (req, res) => {        
        Article.findOne({
            _id: req.params.id
        })
        .populate('author')
        .populate({
            path :'comments',
            model :'Comment',
            populate :{
              path : 'user',
              model : 'User'}})
        .exec()
        .then((result) => {
            Article.updateOne({
                _id: req.params.id
            }, {
                readCount: result.readCount += 1
            })
            .then((data) => {
                res.status(200).json(result)
            })
        }).catch((err) => {            
            res.status(500).json(err)
        });
    },
    del: (req, res) => {
        Article.remove({
            _id: req.params.id
        })
        .then((result) => {
            res.status(200).json({msg: 'Article Deleted', data: result})
        }).catch((err) => {
            res.status(500).json(err)
        });
    },
    getAll: (req, res) => {
        Article.find()
        .sort([['createdAt', 'descending']])
        .populate('author').exec()
        .then((result) => {
            res.status(200).json(result)
        }).catch((err) => {
            res.status(500).json(err)
        });
    },
    edit: (req, res) => {
        if(req.body.title && req.body.img && req.body.text){
            Article.updateOne({
                _id: req.params.id
            }, {
                title: req.body.title,
                img: req.body.img,
                text: req.body.text
            })
            .then((result) => {
                res.status(200).json({msg: 'Edit Article Success', data: result})
            }).catch((err) => {
                res.status(500).json(err)
            });
        } else {
            res.status(500).json({msg: 'Kolom Harus Diisi Semua!'})
        }  
    },
    search: (req, res) => {
        var regexQuery = {
            title: new RegExp(req.params.q, 'i')
        }
        Article.find(regexQuery)
        .sort([['createdAt', 'descending']])
        .then((result) => {
            res.status(200).json({result})
        }).catch((err) => {
            res.status(500).json({err})
        }) 
    },
    myArticles: (req, res) => {
        Article.find({
            author: req.decoded._id
        })
        .sort([['createdAt', 'descending']])
        .then((result) => {
            res.status(200).json(result)
        }).catch((err) => {
            res.status(500).json({err})
        });
    },
    getPopularArticles: (req, res) => {
        Article.find()
        .sort([['readCount', 'descending']])
        .limit(5)
        .populate('author').exec()
        .then((result) => {            
            res.status(200).json(result)
        }).catch((err) => {
            res.status(500).json(err)
        });
    }
}
