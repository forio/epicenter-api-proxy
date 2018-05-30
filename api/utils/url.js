let request = require('request');
request = request.defaults({jar: true});

function toAbsoluteURL(url) {
    const serverRoot = 'api.forio.com/v2';
    const fullURL = `${serverRoot}/${url}`.replace(/\/{1,}/g, '/');
    return `https://${fullURL}`;    
}

exports.fetchFromAPI = function fetchFromAPI(req, cb) {
    const headers = Object.assign(req.headers);
    delete headers['accept-encoding'];
    delete headers.host;

    request({
        method: req.method,
        url: toAbsoluteURL(req.url),
        gzip: false,
        json: true,
        headers: headers
    }, cb);
};

exports.pipeRequest = function pipeRequest(req, res, url) {
    req.pipe(request({
        url: toAbsoluteURL(url),
        qs: req.query,
    })).pipe(res);
};