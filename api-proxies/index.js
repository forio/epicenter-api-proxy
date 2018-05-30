const runProxy = require('./run-api-proxy');
const dataProxy = require('./data-api-proxy');
const defaultAPIProxy = require('./default-api-proxy');

const express = require('express');
const apiProxy = express.Router();
apiProxy.use([runProxy, dataProxy, defaultAPIProxy]);

module.exports = apiProxy;