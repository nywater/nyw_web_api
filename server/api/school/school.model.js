const mongoose = require('mongoose')
const Schema = mongoose.Schema

// // // //

const School = new Schema({
    name: {
        facility: String
    }
},
    // Collection options
    {
        timestamps: {
            createdAt: 'createdOn',
            updatedAt: 'updatedOn'
        },
        versionKey: false
    }
);

// // // //

module.exports = mongoose.model('School', School)
