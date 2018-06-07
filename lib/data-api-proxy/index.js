const express = require('express');
const userScopeProxy = require('./data-api-user-scope-proxy');
const groupScopeProxy = require('./data-api-group-scope-proxy');

const dataAPIProxy = express.Router();
dataAPIProxy.use([userScopeProxy, groupScopeProxy]);

module.exports = dataAPIProxy;