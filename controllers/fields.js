const fieldsRouter = require('express').Router();
const Field = require('../models/field');
const jwt = require('jsonwebtoken');

// get all fields
fieldsRouter.get('/', async (request, response) => { 
  const fields = await Field.find({});
  response.json(fields.map(field => field.toJSON()));
})

//verify login
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

//create field
fieldsRouter.post('/', async (request, response) => {
  const body = request.body;
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  if (decodedToken.id !== process.env.ADMIN_ID) {
    return response.status(401).json({ error: 'forbidden operation' });
  }

  const field = new Field({
    name: body.name,
    ranking: [],
    description: body.description,
  })

  const savedField = await field.save()
  response.json(savedField)
})

//get field name and discription
fieldsRouter.get('/name', async (request, response) => {
  const fields = await Field.find({});
  const fieldNames = fields.map((field) => {
    return Array.from([field.name, field.description]);
  });
  response.json(fieldNames);
})

module.exports = fieldsRouter