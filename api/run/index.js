
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


const express = require('express');
const runRouter = express.Router();

runRouter.route('/run/:runid').get((req, res, next)=> {
    res.json({ route: req.url, user: req.user });
});

module.exports = runRouter;