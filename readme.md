# Epicenter API Proxies

This repository contains Node.js proxies for Epicenter APIs, designed to provide an extra level of authentication for common API requests.

## Pre-requisites

- Enable NodeJS on your Epicenter project (requires an Enterprise account)
- Set Node version to v6.11.1
- (Recommended) Block API calls to standard endpoints

![Node settings](node-settings.png "Node settings")

## Install
```
$ npm install --save epicenter-api-proxy
```

## Usage

### Option 1: Use all default proxies (recommended)

Node
```js
const express = require('express');
const apiProxies = require('epicenter-api-proxy');

const app = express();
app.use('/proxy', apiProxies);
```

To automatically redirect all requests made with Epicenter.js, override the `getAPIPath` function as follows:

For EpicenterJS versions >= 2.7.0
```js
F.service.URL.defaults.baseURL = 'proxy/';
```

For EpicenterJS versions < 2.7.0
```js
var u = new F.service.URL();
F.service.URL.defaults.getAPIPath = function(api) {
    var base = 'proxy/' + api + '/';
    if (['run', 'data', 'file', 'presence'].indexOf(api) !== -1) {
        base += u.accountPath + '/' + u.projectPath + '/';
    }
    return base;
}
```
Note: Override as early as possible, before you instantiate any services/managers.

### Option 2: Pick and choose individual proxies

You can select/override individual proxies by requiring them directly.

```js
const express = require('express');
const userMiddleware = require('epicenter-api-proxy/middleware/add-user-middleware');
const runAPIProxy = require('epicenter-api-proxy/run-api-proxy');
const dataAPIProxy = require('epicenter-api-proxy/data-api-proxy');
const app = express();
app.use(userMiddleware); // populates req.user from the session
app.use('/run-api', runAPIProxy);
app.use('/data-api', dataAPIProxy);
```

Each proxy returns an instance of an [Express Router](https://expressjs.com/en/4x/api.html#router), which you can use to add new middleware/ paths

## Notes

### Data API scoping

Scoping for the Data API is enforced by convention; use the following patterns:

* '<key>_group_<groupid>' as the collection name for group-level settings.
* '<key>_user_<userid>_group_<groupid>' as the collection name for user-level settings.

Scoping is not enforced for any other keys, but you're free to use them at your discretion.

#### Usage with DataService

```js
const am = new F.manager.AuthManager();
const session = am.getCurrentUserSession();

const { groupId, userId } = session;
const groupKey = `some-name_group_${groupId}`;
const groupScopeDataService = new F.service.Data({ root: groupKey });

const userKey = `some-name_user_${userId}_group_${session.groupId}`;
const userScopeDataService = new F.service.Data({ root: userKey });
```

#### Usage with DataManager (available in EpicenterJS >= 2.7)

```js
const DataManager = F.manager.Data;
const groupScopeDataService = new DataManager({ 
    name: 'some-name',
    scope: DataManager.SCOPES.GROUP,
});
const userScopeDataService = new DataManager({ 
    name: 'some-name',
    scope: DataManager.SCOPES.USER,
});
```