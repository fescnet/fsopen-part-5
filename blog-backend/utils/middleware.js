const logger = require('./logger')

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (req, res) => {
  return res.status(404).send({ error: 'Resource not found' })
}

const errorHandler = (error, req, res, next) => {

    if(error.name === 'CastError'){
      return res.status(400).send({ error: 'Malformatted id' })
    }

    if(error.name === 'ValidationError'){
      return res.status(400).send({ error: error.message })
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'invalid token'
      })
    }

    logger.error(error.message)
    next(error)
}

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

const tokenExtractor = (request, response, next) => {
  request.token = getTokenFrom(request)
  next()
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  requestLogger,
  tokenExtractor
}
