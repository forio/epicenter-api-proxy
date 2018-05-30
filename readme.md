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

### Use all default proxies

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

### Pick and choose individual proxies

You can choose/override individual proxies by requiring them directly.

```js
const express = require('express');
const runAPIProxy = require('epicenter-api-proxy/run-api-proxy');
const app = express();
app.use('/run-api', runAPIProxy);
```