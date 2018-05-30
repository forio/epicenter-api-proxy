const express = require('express');
var cors = require('cors');

const apiProxies = require('./api-proxies');
const addUserMiddleware = require('./middleware/add-user-middleware');

const app = express();
app.use(cors({ credentials: true, origin: (origin, cb)=> {
    cb(null, true);
}}));

app.use(addUserMiddleware);
app.use('/api', apiProxies);
app.use((req, res)=> {
    res.status(404);
    res.json({ error: 'Not found' });
});

const PORT = 3000;
app.listen(PORT, ()=> console.log(`Server started at ${PORT}`));