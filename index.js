const express = require('express');

const routeOverrides = require('./api');
const addUserMiddleware = require('./middleware/add-user-middleware');
const defaultAPIMiddleware = require('./middleware/default-api-passthrough-middleware');

const app = express();

app.use(addUserMiddleware);
app.use(routeOverrides);
app.use(defaultAPIMiddleware);

const PORT = 3000;
app.listen(PORT, ()=> console.log(`Server started at ${PORT}`));