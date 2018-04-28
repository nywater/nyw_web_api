const School = require('../school/school.model')

// // // //

/**
* @api {get} /api/cities List
* @apiName list
* @apiGroup City
* @apiDescription Gets a list of all distinct City names
* @apiPermission public
* @apiSuccess {Collection} root Collection of all School cities
* @apiError (500) UnknownException Could not retrieve cities
*/
module.exports.list = (req, res, next) => {
    return School.find().distinct('address.city', (err, response) => {
        res.setHeader('Cache-Control', 'max-age=604800, public');
        return res.status(200).send(response).end();
    }).catch(next);
};
