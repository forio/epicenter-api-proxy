const { pipeRequest } = require('../../utils/url');

const express = require('express');
const dataRouter = express.Router();

function unauthorizedError(req, res) {
    res.status(401).json({
        message: `Insufficient privileges to access ${req.url}`,
        context: {
            url: req.url,
            user: req.user,
        }
    });
}
function blockForNonFacs(req, res) {
    const { isFac, isTeamMember } = req.user;
    if (isFac || isTeamMember) {
        return pipeRequest(req, res, req.url);
    }
    return unauthorizedError(req, res);
}

dataRouter.get('/data/:account/:project/:collectionName-:groupId/:documentId?', (req, res, next)=> {
    const { isFac, isTeamMember, groupId } = req.user;
    if (isFac || isTeamMember || groupId === req.params.groupId) {
        return pipeRequest(req, res, req.url);
    }
    return unauthorizedError(req, res);
});

dataRouter.put('/data/:account/:project/:collectionName-:groupId/:documentId?', blockForNonFacs);
dataRouter.patch('/data/:account/:project/:collectionName-:groupId/:documentId?', blockForNonFacs);
dataRouter.post('/data/:account/:project/:collectionName-:groupId/:documentId?', blockForNonFacs);
dataRouter.delete('/data/:account/:project/:collectionName-:groupId/:documentId?', blockForNonFacs);

module.exports = dataRouter;
