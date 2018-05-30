const singleRunRouter = require('./single-run-router');
const multiRunRouter = require('./multi-run-router');
const { pipeRequest } = require('../utils/url');

const express = require('express');
const runRouter = express.Router();

function skipIfFac(req, res, next) {
    const { isFac, isTeamMember } = req.user;
    if (isFac || isTeamMember) {
        return pipeRequest(req, res, req.url);
    }
    return next();
}
runRouter.use([skipIfFac, singleRunRouter, multiRunRouter]);


module.exports = runRouter;