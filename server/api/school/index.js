const router = require('express').Router();
const controller = require('./school.controller');

// // // //

// GET /schools
router.get('/', controller.list);

// GET /schools/search
router.get('/search', controller.search);

// GET /schools/:id
router.get('/:id', controller.show);

// POST /schools/generate_stats
router.post('/generate_stats', controller.generateStats);

// // // //

module.exports = router;
