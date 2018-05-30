const { fetchFromAPI, pipeRequest } = require('../utils/url');

const express = require('express');
const singleRunProxy = express.Router({ 
    mergeParams: true
});

const validStatusCodes = [200, 201];

function isValidRun(run, user) {
    return (!run.user || run.user.id === user.id);
}

function checkRunPermission(req, res, next) {
    const { account, project, runid } = req.params;
    return fetchFromAPI(req, `run/${account}/${project}/${runid}`, { qs: req.query }, (err, runResponse, body)=> {
        const { runid } = req.params;
        const statusCode = runResponse ? runResponse.statusCode : 500;
        if (err || validStatusCodes.indexOf(runResponse.statusCode) === -1) {
            return res.status(statusCode).send(body);
        }
        if (!isValidRun(body, req.user)) {
            return res.status(401).json({
                message: `Insufficient privileges to access run ${runid}`,
                context: {
                    run: runid,
                    user: req.user,
                }
            });
        }
        return next();
    });
}

function passThrough(req, res, next) {
    const { account, project, runid } = req.params;
    const rest = req.params[0];    
    const url = `run/${account}/${project}/${runid}/${rest}`;
    return pipeRequest(req, res, url);
}
const runFilter = '/run/:account/:project/:runid([a-zA-Z0-9]{36})/*';
singleRunProxy.use(runFilter, [checkRunPermission, passThrough]);

module.exports = singleRunProxy;