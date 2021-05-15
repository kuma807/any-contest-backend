const SubmissionRouter = require('express').Router();
const Submission = require('../models/submission');
const Answer = require('../models/answer');
const Contest = require('../models/contest');
const Problem = require('../models/problem');
const jwt = require('jsonwebtoken');

//verify login
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
}

const fixTime = (time) => {
  if (time.length === 1) {
    return "0" + time;
  }
  return time;
}

//make submission
SubmissionRouter.post('/', async (request, response) => {
  const body = request.body;
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const date = new Date();
  let month = fixTime((date.getMonth() + 1).toString());
  let day = fixTime((date.getDate()).toString());
  let hour = fixTime((date.getHours()).toString());
  let min = fixTime((date.getMinutes()).toString());
  let sec = fixTime((date.getSeconds()).toString());
  const time = `${date.getFullYear()}-${month}-${day} ${hour}:${min}:${sec}`;

  const answer = await Answer.find({name: body.problemName}, {answer: 1});
  const state = (answer.length !== 0 && answer[0]["answer"] === body.answer) ? "OK": "NG";

  const contest = (await Contest.find({"name": body.contestName}, {ranking: 1, startTime: 1, endTime: 1}))[0];
  if (contest.startTime > time) {
    console.log("you can not submit before start");
    response.status(404).end();
    return;
  }

  //update point
  if (state === "OK" && contest.startTime < time && time < contest.endTime) {
    const ranking = contest["ranking"];
    const user = ranking.filter((u) => u.id === decodedToken.id);
    
    if (user.length !== 0 && !user[0].solved.includes(body.problemName)) {
      const point = (await Problem.find({name: body.problemName}, {point: 1}))[0]["point"];
      const newSolved = user[0].solved.concat(body.problemName);
      const newRanking = ranking.map((u) => {
        if (u.id === decodedToken.id) {
          u.solved = newSolved;
          u.point = u.point + point;
          u.submissionTime = time;
        }
        return u;
      })
      Contest.updateOne(
        { name: body.contestName},
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
  }

  const submission = new Submission({
    problemName: body.problemName,
    contestName: body.contestName,
    userid: decodedToken.id,
    time: time,
    state: state,
    answer: body.answer
  });

  const savedSubmission = await submission.save();
  response.json(savedSubmission);
})

//get user submission
SubmissionRouter.post('/userid/', async (request, response) => {
  const body = request.body;
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const submissions = await Submission.find({userid: decodedToken.id}, {_id:0, __v:0});
  if (submissions) {
    response.json(submissions.map(submission => submission.toJSON()));
  } else {
    response.status(404).end()
  }
})

module.exports = SubmissionRouter;