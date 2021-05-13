const ProblemsRouter = require('express').Router();
const Problem = require('../models/problem');
const jwt = require('jsonwebtoken');

ProblemsRouter.get('/', async (request, response) => {
  const problems = await Problem.find({});
  response.json(problems.map(problem => problem.toJSON()));
})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
}

ProblemsRouter.post('/', async (request, response) => {
  const body = request.body;
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  if (decodedToken.id !== process.env.ADMIN_ID) {
    return response.status(401).json({ error: 'forbidden operation' });
  }

  const problem = new Problem({
    name: body.name,
    writer: body.writer,
    contest: body.contest,
    problemStatement: body.problemStatement,
    judgeType: body.judgeType
  });

  const savedProblem = await problem.save();
  response.json(savedProblem);
})

ProblemsRouter.get('/:name', async (request, response) => {
  const problem = await Problem.find({name: request.params.name});
  if (problem) {
    response.json(problem.map(problem => problem.toJSON()));
  } else {
    response.status(404).end()
  }
})

module.exports = ProblemsRouter;
