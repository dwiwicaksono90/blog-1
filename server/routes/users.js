var express = require('express');
var router = express.Router();
var {add, update, login, getUser, subscribe, unSubscribe} = require('../controllers/users')
var {isLogin} = require('../middlewares/auth')

router.get('/', isLogin, getUser)
router.post('/', add)
router.post('/login', login)
router.post('/subscribe', isLogin, subscribe)
router.post('/unSubscribe', isLogin, unSubscribe)

module.exports = router;