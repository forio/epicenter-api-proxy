const factory = require('./data-api-router-factory');

const key = [':collection([a-zA-Z0-9]{1,})', 'user', ':userId([a-f0-9\-]{36})', 'group', ':groupId([a-f0-9\-]{36})'].join('_');
const USER_PATTERN = `${key}/:documentId?`;

function userScopeReadCheck(params, user) {
    const { userId, groupId } = params;
    const { isFac, isTeamMember } = user;

    const isSameGroup = user.groupId === groupId;
    const isSameUser = user.id === userId;

    const canRead = isTeamMember || (isSameGroup && (isSameUser || isFac));
    return canRead;
}

const proxy = factory({
    match: USER_PATTERN,
    canRead: userScopeReadCheck,
    canWrite: userScopeReadCheck
});

module.exports = proxy;