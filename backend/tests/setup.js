// Mock the database module before requiring any other modules
jest.mock('../src/db');

// Now require the app
const { app } = require('../src/index');
const supertest = require('supertest');

// Create a supertest instance with our app
const request = supertest(app);

module.exports = {
  app,
  request
};
