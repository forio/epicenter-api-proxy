const runRouter = require('./run');
const dataRouter = require('./data');
const defaultAPIRouter = require('./default-api-passthrough');

const express = require('express');
const apiRouter = express.Router();
apiRouter.use('/api', [runRouter, dataRouter, defaultAPIRouter]);

module.exports = apiRouter;