const router = require('express').Router();
const controller = require('./city.controller');

// // // //

// GET /cities
router.get('/', controller.list);

// // // //

module.exports = router;
