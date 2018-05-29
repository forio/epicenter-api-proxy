const serverRoot = 'https://api.forio.com/v2';
let request = require('request');
request = request.defaults({jar: true});

const express = require('express');
const runRouter = express.Router();

const validStatusCodes = [200, 201];

function isValidRun(run, user) {
    return (!run.user || run.user.id === user.id);
}

function loadRunForUser(req, cb) {
    const apiURL = `${serverRoot}${req.url}`;
    const headers = Object.assign(req.headers);
    delete headers['accept-encoding'];
    delete headers.host;

    request({
        method: req.method,
        url: apiURL,
        gzip: false,
        json: true,
        headers: headers
    }, cb);
}

runRouter.get('/run/:account/:project/:runfilter', (req, res, next)=> {
    const { account, project, runfilter } = req.params;

    const { isFac } = req.user;
    if (isFac) {
        const apiURL = `${serverRoot}/${req.url}`;
        return req.pipe(request(apiURL)).pipe(res);
    }

    const isMatrixParameter = runfilter.indexOf(';') === 0;
    if (!isMatrixParameter) {
        return loadRunForUser(req, (err, runResponse, body)=> {
            res.status(runResponse.statusCode);
            if (err || validStatusCodes.indexOf(runResponse.statusCode) === -1) {
                return res.send(body);
            }
            if (isValidRun(body, req.user)) {
                return res.send(body);
            } else {
                res.status(401).json({
                    message: `Insufficient privileges to access run ${runfilter}`,
                    context: {
                        run: runfilter,
                        user: req.user,
                    }
                });
            }
        });
    }

    const useridFilter = `;user.id=${req.user.id}`;
    const hasUserFilter = runfilter.indexOf('user.id') !== -1;
    const isFilteringForMyself = runfilter.indexOf(useridFilter) !== -1;
    
    if (hasUserFilter && !isFilteringForMyself) {
        return res.status(401).json({ 
            message: 'Can only filter by your own userid as a non-facilitator',
            context: {
                filter: runfilter,
                user: req.user,
            }
        });
    } 
    const actualFilter = hasUserFilter ? runfilter : `${useridFilter}${runfilter}`;
    const apiURL = `${serverRoot}/run/${account}/${project}/${actualFilter}`;
    req.pipe(request(apiURL)).pipe(res);
});

module.exports = runRouter;