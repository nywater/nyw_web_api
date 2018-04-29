const School = require('../school/school.model')

// // // //

/**
* @api {get} /api/districts List
* @apiName list
* @apiGroup District
* @apiDescription Gets a list of all distinct District names
* @apiPermission public
* @apiSuccess {Collection} root Collection of all School districts
* @apiError (500) UnknownException Could not retrieve districts
*/
module.exports.list = (req, res, next) => {
    return School.find().distinct('district', (err, response) => {
        res.setHeader('Cache-Control', 'max-age=604800, public');
        return res.status(200).send(response).end();
    }).catch(next);
};
