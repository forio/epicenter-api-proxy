const express = require('express');
let request = require('request');
request = request.defaults({jar: true});

const app = express();

const serverRoot = 'https://api.forio.com/v2/';
app.get('/*', (req, res)=> {
    const apiURL = `${serverRoot}/${req.url}`;
    req.pipe(request(apiURL)).pipe(res);
});

const PORT = 3000;
app.listen(PORT, ()=> console.log(`Server started at ${PORT}`));