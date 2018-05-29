const serverRoot = 'https://api.forio.com/v2';
let request = require('request');
request = request.defaults({jar: true});

const express = require('express');
const runRouter = express.Router();

function isValidRun(run, user) {
    return (!run.user || run.user.id === user.id);
}

runRouter.get('/run/:account/:project/:runfilter', (req, res, next)=> {
    const apiURL = `${serverRoot}${decodeURIComponent(req.url)}`;
    const headers = Object.assign(req.headers);
    delete headers['accept-encoding'];
    delete headers.host;

    const validStatusCodes = [200, 201];
    request({
        method: req.method,
        url: apiURL,
        gzip: false,
        json: true,
        headers: headers
    }, (err, response, body)=> {
        res.status(response.statusCode);
        if (err || validStatusCodes.indexOf(response.statusCode) !== -1) {
            return res.send(body);
        }
        if (Array.isArray(body)) { //multirun filter
            const filtered = body.filter((run)=> isValidRun(run, req.user));
            return res.send(filtered);
        }
        if (isValidRun(body, req.user)) {
            return res.send(body);
        } 
        res.send(body);
    });
});

module.exports = runRouter;