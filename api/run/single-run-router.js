const { fetchFromAPI } = require('../utils/url');

const express = require('express');
const singleRunRouter = express.Router({ 
    mergeParams: true
});

const validStatusCodes = [200, 201];

function isValidRun(run, user) {
    return (!run.user || run.user.id === user.id);
}

singleRunRouter.route('/:account/:project/:runid([a-zA-Z0-9]{36})/:rest?*').get((req, res, next)=> {
    return fetchFromAPI(req, `run/${req.url}`, (err, runResponse, body)=> {
        const { runid } = req.params;
        res.status(runResponse.statusCode);
        if (err || validStatusCodes.indexOf(runResponse.statusCode) === -1) {
            return res.send(body);
        }
        if (isValidRun(body, req.user)) {
            return res.send(body);
        } else {
            return res.status(401).json({
                message: `Insufficient privileges to access run ${runid}`,
                context: {
                    run: runid,
                    user: req.user,
                }
            });
        }
    });
});

module.exports = singleRunRouter;