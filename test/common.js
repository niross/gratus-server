/**
 * Setup test environment
 */
global.chai = require('chai');

// should style
global.should = require('chai').should();

// expect style
global.expect = require('chai').expect;

// Supertest
global.supertest = require('supertest');

// force the test environment to 'test'
process.env.NODE_ENV = 'test';

global.api = global.supertest(require('../server'));

global.chai.use(require('dirty-chai'));
