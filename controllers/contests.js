const ContestRouter = require('express').Router();
const Contest = require('../models/contest');
const jwt = require('jsonwebtoken');

//get all contests
ContestRouter.get('/', async (request, response) => {
  const contests = await Contest.find({});
  response.json(contests.map(contest => contest.toJSON()));
})

//verfiy login
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
}

//create contest
ContestRouter.post('/', async (request, response) => {
  const body = request.body;
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  if (decodedToken.id !== process.env.ADMIN_ID) {
    return response.status(401).json({ error: 'forbidden operation' });
  }

  const contest = new Contest({
    name: body.name,
    field: body.field,
    ranking: [],
    description: body.description,
    minRating: body.minRating,
    maxRating: body.maxRating,
    maxperformance: body.maxperformance,
    problemNames: body.problemNames,
    startTime: body.startTime,
    endTime: body.endTime,
    writers: body.writers,
    penalty: body.penalty,
  });

  const savedContest = await contest.save();
  response.json(savedContest);
})

//search contest
ContestRouter.post('/search_by_date', async (request, response) => {
  const body = request.body;
  const fromTime = body.fromTime;
  const toTime = body.toTime;
  const field = body.field;
  console.log(field);
  if (field) {
    const contests = await Contest.find({startTime: {$gte: fromTime, $lte: toTime}, field: field}, {name: 1, field: 1, startTime: 1, endTime: 1});
    response.json(contests.map((contest) => contest.toJSON()));
  }
  else {
    const contests = await Contest.find({startTime: {$gte: fromTime, $lte: toTime}}, {name: 1, field: 1, startTime: 1, endTime: 1});
    response.json(contests.map((contest) => contest.toJSON()));
  }
})

//get contest by name
ContestRouter.get('/:name', async (request, response) => {
  const contest = await Contest.find({"name": request.params.name});
  if (contest) {
    response.json(contest.map(contest => contest.toJSON()));
  } else {
    response.status(404).end()
  }
})

module.exports = ContestRouter;