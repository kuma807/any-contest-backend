const ProblemsRouter = require('express').Router();
const Problem = require('../models/problem');
const Contest = require('../models/contest');
const jwt = require('jsonwebtoken');

const fixTime = (time) => {
  if (time.length === 1) {
    return "0" + time;
  }
  return time;
}

const getTime = () => {
  const date = new Date();
  let month = fixTime((date.getMonth() + 1).toString());
  let day = fixTime((date.getDate()).toString());
  let hour = fixTime((date.getHours()).toString());
  let min = fixTime((date.getMinutes()).toString());
  let sec = fixTime((date.getSeconds()).toString());
  const time = `${date.getFullYear()}-${month}-${day} ${hour}:${min}:${sec}`;
  return time;
}

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
}

//create problem
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
    point: body.point,
    writer: body.writer,
    contest: body.contest,
    problemStatement: body.problemStatement,
    judgeType: body.judgeType
  });

  const savedProblem = await problem.save();
  response.json(savedProblem);
})

//get problem by name
ProblemsRouter.get('/:name', async (request, response) => {
  const problem = await Problem.find({name: request.params.name});
  const contestName = problem[0].contest;

  const contest = (await Contest.find({"name": contestName}, {startTime: 1}))[0];
  const time = getTime();
  console.log(time, contest.startTime);
  if (time < contest.startTime) {
    console.log("you can not see the problem before the starting time");
    response.status(404).end();
    return;
  }

  if (problem) {
    response.json(problem.map(problem => problem.toJSON()));
  } 
  else {
    response.status(404).end()
  }
})

module.exports = ProblemsRouter;
