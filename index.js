const express = require('express');
var cors = require('cors');

const routeOverrides = require('./api');
const addUserMiddleware = require('./middleware/add-user-middleware');
const defaultAPIMiddleware = require('./middleware/default-api-passthrough-middleware');

const app = express();
app.use(cors({ credentials: true, origin: 'http://localhost.forio.com:3401' }));

app.use(addUserMiddleware);
app.use(routeOverrides);
app.use(defaultAPIMiddleware);

const PORT = 3000;
app.listen(PORT, ()=> console.log(`Server started at ${PORT}`));