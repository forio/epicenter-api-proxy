const runProxy = require('./run-api-proxy');
const dataProxy = require('./data-api-proxy');
const defaultAPIProxy = require('./default-api-proxy');

const middlewares = require('./middleware');

const express = require('express');
const apiProxy = express.Router();
localEnv = {};

apiProxy.use(middlewares);
apiProxy.use([runProxy, dataProxy, defaultAPIProxy]);
apiProxy.setLocalEnv = (env) => localEnv = env;

module.exports = apiProxy;