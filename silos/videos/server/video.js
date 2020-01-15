const express = require('express');

let router = express.Router();

router.use('/videos', require('../routes/routes-videos'));

module.exports = router;
