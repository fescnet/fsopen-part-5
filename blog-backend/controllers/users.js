const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1, id: 1 })
  res.json(users)
})

usersRouter.post('/', async (req, res) => {

  const body = req.body

  if(!body.password){
    return res.status(400).send({ error: 'User validation failed: password: Path `password` is required.' })
  }

  const passwordMinLength = 3
  if(body.password.length < passwordMinLength){
    return res.status(400).send({ error: `User validation failed: password: Path 'password' ('${body.password}') is shorter than the minimum allowed length (${passwordMinLength}).` })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)
  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash: passwordHash
  })
  const createdUser = await user.save()
  res.status(201).json(createdUser)
})

module.exports = usersRouter
