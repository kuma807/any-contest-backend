const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (request, response) => {
  const body = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    id: body.id,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save((err, user) => {
    if (err) {
      console.log(err);
      response.send(400, 'couldnt save user in backend/controllers/users');
    }
  })
  const userForToken = {
    id: user.id,
    name: user.name,
  }

  const token = jwt.sign(userForToken, process.env.SECRET);

  response
    .status(200)
    .send({ token, userid: user.id, name: user.name });
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('notes', { content: 1, date: 1 })
    
  response.json(users.map(u => u.toJSON()))
})

module.exports = usersRouter