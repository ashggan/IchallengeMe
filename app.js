const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const db = require('./config/db_conn');

const app = express();

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

// routes
app.use('/users', require('./routes/usersRouter'));

// start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT,console.log('server runing on port '+PORT+' ... '));