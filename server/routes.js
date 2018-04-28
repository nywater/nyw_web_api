const router = require('express').Router()

// // // //

// Bootstrap API routers
router.use('/cities', require('./api/city'))
router.use('/schools', require('./api/school'))

// // // //

module.exports = router
