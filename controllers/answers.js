const AnswerRouter = require('express').Router();
const Answer = require('../models/answer');
const jwt = require('jsonwebtoken');

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
}

//create answer
AnswerRouter.post('/', async (request, response) => {
  const body = request.body;
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  if (decodedToken.id !== process.env.ADMIN_ID) {
    return response.status(401).json({ error: 'forbidden operation' });
  }

  const answer = new Answer({
    name: body.name,
    answer: body.answer
  });

  const savedAnswer = await answer.save();
  response.json(savedAnswer);
})

module.exports = AnswerRouter; 