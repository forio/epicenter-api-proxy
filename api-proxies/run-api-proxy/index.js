const singleRunProxy = require('./single-run-proxy');
const multiRunProxy = require('./multi-run-proxy');
const { pipeRequest } = require('../utils/url');

const express = require('express');
const runProxy = express.Router();

function skipIfFac(req, res, next) {
    const { isFac, isTeamMember } = req.user;
    if (isFac || isTeamMember) {
        return pipeRequest(req, res, `run/${req.url}`);
    }
    return next();
}
runProxy.use('/run', skipIfFac);
runProxy.use([singleRunProxy, multiRunProxy]);


module.exports = runProxy;