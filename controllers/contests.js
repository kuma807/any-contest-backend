const ContestRouter = require('express').Router();
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
  if (field) {
    const contests = await Contest.find({startTime: {$gte: fromTime, $lte: toTime}, field: field}, {name: 1, field: 1, startTime: 1, endTime: 1});
    response.json(contests.map((contest) => contest.toJSON()));
  }
  else {
    const contests = await Contest.find({startTime: {$gte: fromTime, $lte: toTime}}, {name: 1, field: 1, startTime: 1, endTime: 1});
    response.json(contests.map((contest) => contest.toJSON()));
  }
})

//check if registered
ContestRouter.post('/check_registered', async (request, response) => {
  const body = request.body;
  const ranking = (await Contest.find({"name": body.contestName}, {ranking: 1}))[0]["ranking"];
  const found = ranking.filter((u) => u.userid === body.userid).length === 0 ? false: true;
  response.json(found);
})

//register
ContestRouter.post('/register/', async (request, response) => {
  const body = request.body;
  const contestName = body.contestName;
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = { 
    name: decodedToken.id,
    id: decodedToken.id,
    point: 0,
    solved: [],
    submissionTime: "2000-00-00 00:00:00"
  }
  const contest = (await Contest.find({"name": contestName}, {ranking: 1, startTime: 1}))[0];
  const time = getTime();
  if (contest.startTime < time) {
    console.log("you can not register after the contest started");
    response.status(404).end();
    return;
  }
  const ranking = contest["ranking"];
  const found = ranking.filter((u) => u.id === decodedToken.id).length === 0 ? false: true;
  if (!found) {
    Contest.updateOne(
      { name: contestName },
      { $push: { ranking: user } },
      function(err, result) {
        if (err) {
          response.send(err);
        } else {
          response.json(result);
        }
      }
    );
  }
  else {
    console.log("already registered");
    response.status(404).end();
  }
})

//unregister
ContestRouter.post('/unregister/', async (request, response) => {
  const body = request.body;
  const contestName = body.contestName;
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const contest = (await Contest.find({"name": contestName}, {ranking: 1, startTime: 1}))[0];
  const time = getTime();
  if (contest.startTime < time) {
    console.log("you can not unregister after the contest started");
    response.status(404).end();
    return;
  }
  const ranking = contest["ranking"];
  const newRanking = ranking.filter((u) => u.id !== decodedToken.id);
  if (ranking.length !== newRanking.length) {
    Contest.updateOne(
      { name: contestName},
      { ranking: newRanking }, function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
            console.log("Updated Docs");
        }
      }
    );
  }
  else {
    console.log("not registered");
    response.status(404).end();
  }
})

//get ranking
ContestRouter.get('/ranking/:contestName', async (request, response) => {
  const contestName = request.params.contestName;
  const ranking = (await Contest.find({"name": contestName}, {ranking: 1}))[0]["ranking"];
  response.json(ranking);
})

//get contest by name
ContestRouter.get('/:name', async (request, response) => {
  const contest = await Contest.find({"name": request.params.name});
  const time = getTime();
  if (contest[0].startTime > time) {
    contest[0].problemNames = [];
    //__v === contestStarted
    contest[0].__v = false;
  }
  else {
    contest[0].__v = true;
  }
  if (contest) {
    response.json(contest.map(contest => contest.toJSON()));
  } else {
    response.status(404).end()
  }
})


module.exports = ContestRouter;