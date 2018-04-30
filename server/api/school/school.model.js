const mongoose = require('mongoose')
const Schema = mongoose.Schema

// // // //

const School = new Schema({
    name: String,
    stats: Schema.Types.Mixed
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
