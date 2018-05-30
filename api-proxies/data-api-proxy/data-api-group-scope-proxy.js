const factory = require('./data-api-router-factory');

const key = [':collection([a-zA-Z0-9]{1,})', 'group', ':groupId([a-f0-9\-]{36})'].join('_');
const GROUP_PATTERN = `${key}/:documentId?`;

function groupScopeReadCheck(params, user) {
    const { isFac, isTeamMember } = user;

    const isSameGroup = user.groupId === params.groupId;
    return isTeamMember || (isSameGroup || isFac);
}
function groupScopeWriteCheck(params, user) {
    const { isFac, isTeamMember } = user;

    const isSameGroup = user.groupId === params.groupId;
    return isTeamMember || (isSameGroup && isFac);
}

const proxy = factory({
    match: GROUP_PATTERN,
    canRead: groupScopeReadCheck,
    canWrite: groupScopeWriteCheck
});

module.exports = proxy;