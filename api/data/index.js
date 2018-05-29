const { pipeRequest } = require('../../utils/url');

const express = require('express');
const dataRouter = express.Router();

function unauthorizedError(req, res) {
    const { groupId } = req.user;
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

dataRouter.get('/data/:account/:project/settings-:groupId/(.*)', (req, res, next)=> {
    const { isFac, isTeamMember, groupId } = req.user;
    if (isFac || isTeamMember || groupId === req.params.groupId) {
        return pipeRequest(req, res, req.url);
    }
    return unauthorizedError(req, res);
});

dataRouter.put('/data/:account/:project/settings-:groupId/(.*)', blockForNonFacs);
dataRouter.patch('/data/:account/:project/settings-:groupId/(.*)', blockForNonFacs);
dataRouter.post('/data/:account/:project/settings-:groupId/(.*)', blockForNonFacs);

module.exports = dataRouter;
