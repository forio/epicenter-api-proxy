# Epicenter API Proxies

This repository contains proxies for Epicenter APIs, designed to provide an extra level of authentication for common API requests.

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

### Option 1: Use all default proxies

Node
```js
const express = require('express');
const apiProxies = require('epicenter-api-proxy');

const app = express();
app.use('/proxy', apiProxies);
```

To automatically redirect all requests made with Epicenter.js, override the `getAPIPath` function as follows:
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

You can choose/override individual proxies by requiring them directly.

```js
const express = require('express');
const runAPIProxy = require('epicenter-api-proxy/run-api-proxy');
const dataAPIProxy = require('epicenter-api-proxy/data-api-proxy');
const app = express();
app.use('/run-api', runAPIProxy);
```

## Notes

### Data API scoping

Scoping for the Data API is enforced by convention; Use:

* '<key>_group_<groupid>' as the collection name (the `root` field in `F.service.Data`) for group-level settings.
* '<key>_user_<userid>' as the collection name (the `root` field in `F.service.Data`) for user-level settings.

Scoping is not enforced for any other keys, but you're free to use them at your discretion.