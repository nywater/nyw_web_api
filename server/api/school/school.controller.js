const _ = require('lodash')
const School = require('./school.model')

// Defines the attributes returned when searching
const searchResultAttrs = ['_id', 'beds_code', 'name', 'district']

// Defines default pagination options
function handlePagination (req) {
    let page = Number(req.query.page) || 1;
    page = Math.max(page - 1, 0)
    let per_page = Number(req.query.per_page) || 10;
    let skip = per_page * page;
    return { page, per_page, skip }
}

// // // //

/**
* @api {get} /api/schools List
* @apiName list
* @apiGroup School
* @apiDescription Gets a paginated list of Schools
* @apiPermission public
* @apiSuccess {Collection} root Collection of School records
* @apiError (500) UnknownException Could not retrieve School collection
*/
module.exports.list = (req, res, next) => {

    let query = {}
    let { page, per_page, skip } = handlePagination(req)

    // Queries and Paginates
    return School.find(query, searchResultAttrs)
      .sort({ district: 1 })
      .limit(per_page)
      .skip(skip)
      .lean()
      .exec()
      .then((response) => {
        return res
        .status(200)
        .json({
          page: page + 1,
          per_page: per_page,
          items: response
        })
        .end();
      })
      .catch((err) => {
        handleError(res, err)
      })
};

/**
* @api {get} /api/schools/search Search
* @apiName search
* @apiGroup School
* @apiDescription Gets a paginated list of Schools of a particular district and query
* @apiPermission public
* @apiSuccess {Collection} root Collection of School records matching the query
* @apiError (500) UnknownException Could not retrieve School collection
*/
module.exports.search = (req, res, next) => {

    // Handles user queries
    let query = {}
    let { page, per_page, skip } = handlePagination(req)
    let searchQuery = req.query.q

    // Regex matching for text search
    let matchQuery = [
        { name: new RegExp(searchQuery, 'i') },
    ]

    // Builds query
    if (req.query.district) {
        query['$and'] = [
            { '$or': matchQuery },
            { 'district': req.query.district }
        ]
    } else {
        query['$and'] = [
            { '$or': matchQuery }
        ]
    }

    // Queries and Paginates
    return School.find(query, searchResultAttrs)
      .sort({ district: 1 })
      .limit(per_page)
      .skip(skip)
      .lean()
      .exec()
      .then((response) => {
        return res
        .status(200)
        .json({
          page: page + 1,
          per_page: per_page,
          items: response
        })
        .end();
      })
      .catch((err) => {
        handleError(res, err)
      })
};

/**
* @api {get} /api/schools/:id Show
* @apiName show
* @apiGroup School
* @apiDescription Gets a School and all associated inspections
* @apiPermission public
* @apiSuccess {Model} root School with inspections records
* @apiError (500) UnknownException Could not retrieve School model
*/
module.exports.show = (req, res, next) => {
    return School.findOne({ _id: req.params.id })
    .then((response) => {
        return res
        .status(200)
        .send(response)
        .end();
    }).catch(next);
};

/**
* @api {post} /api/schools/generateStats Generate Stats
* @apiName generateStats
* @apiGroup School
* @apiDescription Generates statistics for all schools
* @apiPermission public
* @apiSuccess {Model} root Successfully generated statistics
* @apiError (500) UnknownException Could not generate statistics
*/
// TODO - This controller function is HOT GARBAGE
module.exports.generateStats = (req, res, next) => {
    return School.find({})
    .lean()
    .exec()
    .then((schools) => {

        // Iterates over each school, generate school.stats
        schools = _.map(schools, (school) => {

            // Sanitizes values
            school['outlets_gt_15ppb'] = Number(school['outlets_gt_15ppb']) || 0
            school['outlets_leq_15ppb'] = Number(school['outlets_leq_15ppb']) || 0

            // Isolates variables
            let gt15 = school['outlets_gt_15ppb']
            let leq15 = school['outlets_leq_15ppb']

            // Calculates statistics
            let pct_compliant = leq15 / (leq15 + gt15)
            let pct_non_compliant = gt15 / (leq15 + gt15)

            // Adds school.stats
            school.stats = {
                pct_compliant,
                pct_non_compliant
            }

            return school
        })

        // // // //
        // Calculates percentile rank

        function countOfValueInArray(val) {
            let subset = _.filter(schools, (s) => {
                return s.stats.pct_compliant === val
            })

            return subset.length
        }

        function lessThanValuesInArray(val) {
            let subset = _.filter(schools, (s) => {
                return s.stats.pct_compliant < val
            })

            return subset.length
        }

        // Iterates over each school again and calculates the percentile rank
        updatedSchools = _.map(schools, (s) => {

            let N = schools.length
            let L = lessThanValuesInArray(s.stats.pct_compliant)
            let S = countOfValueInArray(s.stats.pct_compliant)

            let rank = (L + (S/2))/N * 100
            s.stats.rank = rank
            return s
        })

        // Saves each school with updated stats
        _.each(updatedSchools, (s) => {
            School.findById(s._id).then((doc) => {
                doc.outlets_gt_15ppb = s.outlets_gt_15ppb
                doc.outlets_leq_15ppb = s.outlets_leq_15ppb
                doc.stats = s.stats
                doc.save()
            })
        })

        // // // //

        return res
        .status(200)
        .send(updatedSchools)
        .end();

    }).catch(next);
};
