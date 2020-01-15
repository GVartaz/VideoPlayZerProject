const express = require('express');

let router = express.Router();

router.use('/users', require('../routes/routes-user'));

module.exports = router;
