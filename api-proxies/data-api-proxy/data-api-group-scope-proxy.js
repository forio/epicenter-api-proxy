const factory = require('./data-api-router-factory');

const basePattern = '/data/:account/:project';
const GROUP_PATTERN = `${basePattern}/:collection_group_:groupId/:documentId?`;

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