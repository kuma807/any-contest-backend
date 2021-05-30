const config = require('./utils/config')
const express = require('express')
const mongoose = require('mongoose')
const path = require('path');
const app = express()
require('express-async-errors')
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const fieldsRouter = require('./controllers/fields')
const contestsRouter = require('./controllers/contests')
const problemsRouter = require('./controllers/problems')
const submissionsRouter = require('./controllers/submissions')
const answersRouter = require('./controllers/answers')
const ratingsRouter = require('./controllers/rating/ratings')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/fields', fieldsRouter)
app.use('/api/contests', contestsRouter)
app.use('/api/problems', problemsRouter)
app.use('/api/submissions', submissionsRouter)
app.use('/api/answers', answersRouter)
app.use('/api/ratings', ratingsRouter)
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
