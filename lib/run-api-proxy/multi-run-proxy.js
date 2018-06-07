const { pipeRequest } = require('../utils/url');

const express = require('express');
const multiRunProxy = express.Router({
    mergeParams: true,
});

function handleMultiRunFilter(req, res, next) {
    const { account, project } = req.params;

    const runfilter = req.params[0] || '';
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
}
// multiRunProxy.get(, handleMultiRunFilter);
multiRunProxy.get([
    '/run/:account/:project',
    '/run/:account/:project/*'
], handleMultiRunFilter);

module.exports = multiRunProxy;