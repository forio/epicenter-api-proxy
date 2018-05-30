const factory = require('./data-api-router-factory');
const USER_PATTERN = '/:collection_user_:userid_group_:groupId/:documentId?';

function userScopeReadCheck(params, user) {
    const { userid, groupId } = params;
    const { isFac, isTeamMember } = user;

    const isSameGroup = user.groupId === groupId;
    const isSameUser = user.id === userid;

    const canRead = isTeamMember || (isSameGroup && (isSameUser || isFac));
    return canRead;
}

const proxy = factory({
    match: USER_PATTERN,
    canRead: userScopeReadCheck,
    canWrite: userScopeReadCheck
});

module.exports = proxy;