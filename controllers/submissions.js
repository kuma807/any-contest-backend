const SubmissionRouter = require('express').Router();
const Submission = require('../models/submission');
const Answer = require('../models/answer');
const jwt = require('jsonwebtoken');

SubmissionRouter.get('/', async (request, response) => {
  const submissions = await Submission.find({});
  response.json(submissions.map(submission => submission.toJSON()));
})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
}

SubmissionRouter.post('/', async (request, response) => {
  const body = request.body;
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const date = new Date();
  const time = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  const answer = await Answer.find({name: body.name}, {answer: 1});
  const state = (answer.length !== 0 && answer[0]["answer"] === body.answer) ? "OK": "NG";

  const submission = new Submission({
    userid: decodedToken.id,
    time: time,
    state: state,
    answer: body.answer
  });

  const savedSubmission = await submission.save();
  response.json(savedSubmission);
})

SubmissionRouter.get('/userid/:userid', async (request, response) => {
  const submissions = await Submission.find({userid: request.params.userid});
  if (submissions) {
    response.json(submissions.map(submission => submission.toJSON()));
  } else {
    response.status(404).end()
  }
})

module.exports = SubmissionRouter;