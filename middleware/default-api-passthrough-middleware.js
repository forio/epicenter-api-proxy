const serverRoot = 'api.forio.com/v2';
let request = require('request');
request = request.defaults({jar: true});

module.exports = function defaultAPIPassThroughMiddleware(req, res) {
    const apiURL = `${serverRoot}/${req.url}`.replace(/\/{1,}/g, '/');
    req.pipe(request(`https://${apiURL}`)).pipe(res);
};