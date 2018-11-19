var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.send('hollaaaa... server blog ndiw')
})

module.exports = router;
