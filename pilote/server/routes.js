const express = require('express');

var router = express.Router();

router.use('/users', require('../routes/routes-user'));
router.use('/videos', require('../routes/routes-videos'));

module.exports = router;
