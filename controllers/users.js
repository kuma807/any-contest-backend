const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

//verify login
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

//create user
usersRouter.post('/', async (request, response) => {
  const body = request.body

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  if (body.id.startsWith("@")) {
    const token = getTokenFrom(request);
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    if (decodedToken.id !== process.env.ADMIN_ID) {
      return response.status(401).json({ error: 'id can not start with @' });
    }
  }

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