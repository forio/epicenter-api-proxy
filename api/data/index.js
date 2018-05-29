const serverRoot = 'https://api.forio.com/v2';
let request = require('request');
request = request.defaults({jar: true});

const express = require('express');
const runRouter = express.Router();

