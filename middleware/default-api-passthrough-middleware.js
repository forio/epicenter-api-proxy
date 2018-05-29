const serverRoot = 'https://api.forio.com/v2/';
let request = require('request');
request = request.defaults({jar: true});

module.exports = function defaultAPIPassThroughMiddleware(req, res) {
    const apiURL = `${serverRoot}/${req.url}`;
    req.pipe(request(apiURL)).pipe(res);
};