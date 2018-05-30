const { pipeRequest } = require('../utils/url');

const express = require('express');
const multiRunProxy = express.Router({
    mergeParams: true,
});

multiRunProxy.get('/run/:account/:project/:runfilter*', (req, res, next)=> {
    const { account, project, runfilter } = req.params;

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

module.exports = multiRunProxy;