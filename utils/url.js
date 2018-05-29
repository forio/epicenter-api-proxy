const serverRoot = 'https://api.forio.com/v2';
let request = require('request');
request = request.defaults({jar: true});

exports.fetchFromAPI = function fetchFromAPI(req, cb) {
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
};

exports.pipeRequest = function pipeRequest(req, res, url) {
    req.pipe(request(url)).pipe(res);
};