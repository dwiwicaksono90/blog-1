var express = require('express');
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
const db = mongoose.connection

mongoose.set('useCreateIndex', true)

const DB_URL = process.env.NODE_ENV === 'test' ? process.env.DB_TEST : process.env.DB_PRODUCTION
mongoose.connect(DB_URL, { useNewUrlParser: true })

db
  .on('error', console.error.bind(console, 'connection error:'))
  .once('open', function () {
    console.log('> DB Connected')
  })

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var articleRouter = require('./routes/articles')
var commentRouter = require('./routes/comments')

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/articles', articleRouter);
app.use('/comments', commentRouter)


module.exports = app;
