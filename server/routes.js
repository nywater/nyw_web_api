const router = require('express').Router()

// // // //

// Bootstrap API routers
router.use('/districts', require('./api/district'))
router.use('/schools', require('./api/school'))

// // // //

module.exports = router
