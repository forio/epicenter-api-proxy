
// function verifyAccessForRun(runid, userid) {
//     // request.get()
// }

// api.post('*', ()=> {
//     //directly pipe
// });

// //Do this as a middleware?
// api.patch(/run/:runid/, (req, res)=> {
//     verifyAccessForRun(runid, userid).then(()=> {
//         res.pipe()
//     }, ()=> {
//         res.end(401);
//     });
// });
// //Do this as a middleware?
// api.get(/run/:runfilter/, (req, res)=> {
//     if (runfilter.indexOf(';') !== -1) {
//         //inject scope.user and call it a day;
//     }
    
//     verifyAccessForRun(runid, userid).then(()=> {
//         res.pipe()
//     }, ()=> {
//         res.end(401);
//     });
// });
// //Do this as a middleware?
// api.get(/run/:runid/va, (req, res)=> {
//     verifyAccessForRun(runid, userid).then(()=> {
//         res.pipe()
//     }, ()=> {
//         res.end(401);
//     });
// });


const serverRoot = 'https://api.forio.com/v2';
let request = require('request');
request = request.defaults({jar: true});

const JSONStream = require('JSONStream');
const streamFilter = require('stream-filter');

// module.exports = function defaultAPIPassThroughMiddleware(req, res) {
//     const apiURL = `${serverRoot}/${req.url}`;
//     req.pipe(request(apiURL)).pipe(res);
// };

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
        method: 'GET',
        url: apiURL,
        gzip: false,
        json: true,
        headers: headers
    }, (err, response, body)=> {
        // if (err) {
        //     res.status(response.status).send.res
        // }
        res.status(response.statusCode);
        if (validStatusCodes.indexOf(response.statusCode) !== -1) {
            return res.send(body);
        }
        if (Array.isArray(body)) { //multirun filter
            const filtered = body.filter((run)=> isValidRun(run, req.user));
            return res.send(filtered);
        }
        if (isValidRun(body, req.user)) {
            return res.send(body);
        } 
        console.log(err, response, body); 
        res.send(body);
    });
});

module.exports = runRouter;