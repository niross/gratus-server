/**
 * Allow for the use of es6 by wrapping the server with babel-register
 */
require('babel-register');
const app = require('./server');
module.exports = app;