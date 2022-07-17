require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');

const app = express();

app.use(cors());
dbConnection();
// joferdev
// tingomaria201596
app.listen( process.env.PORT, () => {
    console.log('servidor corriendo en puerto' + process.env.PORT);
});