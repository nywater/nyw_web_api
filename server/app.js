const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')

// // // //

// Express.js App & Configuration
const app = express();

// parse JSON and url-encoded query
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// print the request log on console
app.use(morgan('dev'));

// TODO - enable/disable mount point when running in dev/production
// Boostrap API routes - scopes all routes under /
app.use('/api', require('./routes'));
// app.use(require('./routes'));

// // // //

// Exports Express app
module.exports = app;