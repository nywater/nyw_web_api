const router = require('express').Router();
const controller = require('./school.controller');

// // // //

// GET /schools
router.get('/', controller.list);

// GET /schools/search
router.get('/search', controller.search);

// GET /schools/:id
router.get('/:id', controller.show);

// // // //

module.exports = router;
