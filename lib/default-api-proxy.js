const { pipeRequest } = require('./utils/url');

module.exports = function defaultAPIPassThroughMiddleware(req, res) {
    return pipeRequest(req, res, req.url);
};