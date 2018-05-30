const { fetchFromAPI, pipeRequest } = require('../utils/url');

const express = require('express');
const runRouter = express.Router();

const validStatusCodes = [200, 201];

function isValidRun(run, user) {
    return (!run.user || run.user.id === user.id);
}

runRouter.get('/run/:account/:project/:runid([a-zA-Z0-9]{36})', (req, res, next)=> {
    return fetchFromAPI(req, (err, runResponse, body)=> {
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

runRouter.get('/run/:account/:project/:runfilter', (req, res, next)=> {
    const { account, project, runfilter } = req.params;

    const { isFac, isTeamMember } = req.user;
    if (isFac || isTeamMember) {
        return next();
    }

    const useridFilter = `;user.id=${req.user.id}`;
    const hasUserFilter = runfilter.indexOf('user.id') !== -1;
    const isFilteringForMyself = runfilter.indexOf(useridFilter) !== -1;
    
    if (hasUserFilter && !isFilteringForMyself) {
        return res.status(401).json({ 
            message: 'Can only filter by your own userid as a non-facilitator',
            context: {
                run: runfilter,
                user: req.user,
            }
        });
    } 
    const actualFilter = hasUserFilter ? runfilter : `${useridFilter}${runfilter}`;
    const apiURL = `run/${account}/${project}/${actualFilter}`;
    return pipeRequest(req, res, apiURL);
});

module.exports = runRouter;