const Rating = require('../models/rating');
const RatingRouter = require('express').Router();
const glicko2 = require('glicko2');
const Contest = require('../models/contest');
const jwt = require('jsonwebtoken');

var settings = {
  // tau : "Reasonable choices are between 0.3 and 1.2, though the system should
  //      be tested to decide which value results in greatest predictive accuracy."
  tau : 0.5,
  // rating : default rating
  rating : 1500,
  //rd : Default rating deviation 
  //     small number = good confidence on the rating accuracy
  rd : 200,
  //vol : Default volatility (expected fluctation on the player rating)
  vol : 0.06
};
var glicko = new glicko2.Glicko2(settings);

const compare = (a, b) => {
  if (a.point === b.point) {
    if (a.submissionTime === b.submissionTime) {
      return 0;
    }
    if (a.submissionTime > b.submissionTime) {
      return 1;
    }
    else {
      return -1;
    }
  }
  return b.point - a.point;
}

const fixTime = (time) => {
  if (time.length === 1) {
    return "0" + time;
  }
  return time;
}

const timeToString = (date) => {
  let month = fixTime((date.getMonth() + 1).toString());
  let day = fixTime((date.getDate()).toString());
  let hour = fixTime((date.getHours()).toString());
  let min = fixTime((date.getMinutes()).toString());
  let sec = fixTime((date.getSeconds()).toString());
  const time = `${date.getFullYear()}-${month}-${day} ${hour}:${min}:${sec}`;
  return time;
}

//verfiy login
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
}

//calculate rate for contest
RatingRouter.post('/calculate', async (request, response) => {
  const body = request.body;
  const contestName = body.contestName;
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  if (decodedToken.id !== process.env.ADMIN_ID) {
    return response.status(401).json({ error: 'forbidden operation' });
  }
  const contest = (await Contest.find({name: contestName}))[0];
  contest.ranking.map((user) => {
    const submissionTime = user.submissionTime;
    const numPenalty = user.numPenalty;
    let time = new Date(Date.parse(submissionTime));
    time.setSeconds(time.getSeconds() + contest.penalty * numPenalty);
    user.submissionTime = timeToString(time);
  });
  contest.ranking.sort(compare);
  const rating = await Rating.find({fieldName: contest.field});
  const mapRating = {};
  rating.forEach((rate) => {
    if (rate.ratingData.length === 0) {
      mapRating[rate.userid] = {
        rating : 1500,
        rd : 200,
        vol : 0.06
      }
    }
    else {
      mapRating[rate.userid] = rate.ratingData[rate.ratingData.length - 1];
    }
  })
  const contestResult = [];
  let beforePoint = contest.ranking[0].point + 1;
  let beforeTime = contest.ranking[0].submissionTime;
  for (let index = 0; index < contest.ranking.length; index++) {
    const rank = contest.ranking[index];
    const userRatingData = mapRating[rank.id];
    let user = glicko.makePlayer(userRatingData.rating, userRatingData.rd, userRatingData.vol);
    user.id = rank.id;
    if (beforePoint !== rank.point) {
      beforePoint = rank.point;
      beforeTime = rank.submissionTime;
      contestResult.push([user]);
    }
    else if (beforeTime !== rank.submissionTime) {
      beforeTime = rank.submissionTime;
      contestResult.push([user]);
    }
    else {
      contestResult[contestResult.length - 1].push(user);
    }
  }
  const race = glicko.makeRace(contestResult);
  glicko.updateRatings(race);
  const users = glicko.getPlayers();

  const mapCalcRating = {};
  users.forEach((user) => {
    const ratingDatum = { 
      contestName: contestName, 
      rating: user.getRating(), 
      rd: user.getRd(),
      vol: user.getVol()
    }
    mapCalcRating[user.id] = ratingDatum;
  })

  rating.forEach(
    function(e){
      if(mapCalcRating[e.userid]){
        e.ratingData.push(mapCalcRating[e.userid]);
        e.save();
      }
    }
  )
})

RatingRouter.post('/query', async (request, response) => {
  const body = request.body;
  const rating = await Rating.find({
    userid: body.userid,
    fieldName: body.fieldName
  }, {ratingData: 1});
  response.json(rating);
})

RatingRouter.get('/userid/:userid', async (request, response) => {
  const userid = request.params.userid;
  const rating = await Rating.find({
    userid: userid
  });
  response.json(rating);
})

module.exports = RatingRouter; 
