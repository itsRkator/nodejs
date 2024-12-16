const express = require('express');
const bodyParser = require('body-parser');
const mainRouter = require('./src/routers/router');

const app = express();
app.use(bodyParser.json());


app.use('/api', mainRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});