const cookieParser = require('cookie');
const jwtdecode = require('jwt-decode');

function userFromJWT(jwt) {
    if (!jwt) {
        return null;
    }
    const decoded = jwtdecode(jwt);
    const userName = decoded.user_name.split('/')[0];
    return {
        userId: decoded.user_id,
        userName: userName,
        account: decoded.parent_account_id,
    };
}

function userFromCookie(cookieHeader) {
    const cookies = cookieParser.parse([].concat(cookieHeader || '')[0]);
    const jwt = cookies['epicenter.token'];
    return userFromJWT(jwt);
}

function userFromAuthHeader(authHeader) {
    if (!authHeader) {
        return null;
    }
    const jwt = authHeader.split(' ')[0];
    return userFromJWT(jwt);
}

module.exports = function addUserMiddleware(req, res, next) {
    const user = userFromAuthHeader(req.headers.authorization) || userFromCookie(req.headers.cookie);
    req.user = user;
    next();  
};