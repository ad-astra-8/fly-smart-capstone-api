//loading external resources
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const {CLIENT_ORIGIN} = require('./config');
const { NODE_ENV } = require('./config')


//loading routers
const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');
const noteRouter = require('./note/note-router');
const checklistRouter = require('./checklist/checklist-router');

//building app object
const app = express()


//morgan settings
const morganOption = (process.env.NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

//app using morgan cors and helmet
app.use(morgan(morganOption))
app.use(cors());
app.use(helmet());

//using basic api endpoints
app.get('/', (req, res) => {
    res.send('Hello, world!')
})

//list of routers
app.use('/api/notes', noteRouter);
app.use('/api/checklist', checklistRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

//error handler
app.use(function errorHandler(error, req, res, next) {
    let response
    if (process.env.NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

//exporting app to use it in the server
module.exports = app