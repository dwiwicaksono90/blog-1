var express = require('express');
var router = express.Router();
const {add, del} = require('../controllers/comments')
const {isLogin, isSelf, isSelfComment} = require('../middlewares/auth')

router.post('/', isLogin, add)
router.delete('/', isLogin, isSelfComment, del)

module.exports = router;
