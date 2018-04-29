const router = require('express').Router();
const controller = require('./district.controller');

// // // //

// GET /district
router.get('/', controller.list);

// // // //

module.exports = router;
