const express = require('express');

const basePattern = '/data/:account/:project';
function checkAndReject(condition, req, res, next) {
    const allow = condition(req.params, req.user);
    if (allow) {
        return next();
    }
    return res.status(401).json({
        message: `Insufficient privileges to access ${req.url}`,
        context: {
            url: req.url,
            user: req.user,
            params: req.params,
        }
    });
}

module.exports = function dataAPIRouterFactory(params) {
    const { match, canRead, canWrite } = params;
    const dataAPIProxy = express.Router();

    dataAPIProxy.get(`${basePattern}/${match}`, (req, res, next)=> {
        checkAndReject(canRead, req, res, next);
    });

    const writeMethods = ['put', 'patch', 'post', 'delete',];
    writeMethods.forEach((method)=> {
        dataAPIProxy[method](`${basePattern}/${match}`, (req, res, next)=> {
            checkAndReject(canWrite, req, res, next);
        });
    });

    return dataAPIProxy;
};