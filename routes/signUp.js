const route = require('express').Router()
const tokenGenerator = require('jsonwebtoken')

let User = require('../models/users.model')

// Handle when url -> /signup 
route.post('/', async function(req, res) {
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')
     console.log(`---> Route Hit: ${req.originalUrl}`)
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')

     const username = req.body.username
     const email = req.body.email
     const password = req.body.password

     try {
          const user = await User.findOne({ email }) // look if email already exist in database
          if(user) { // email already registered
               res.status(406).send({ message: 'User already registered.', reason: "Email already in use."})
          } 

          // new user
          const newUser = new User({ username, password, email, gender: '' })
          const rawData = await newUser.save()

          const token = tokenGenerator.sign({ id: rawData._id }, process.env.AUTH_KEY, { expiresIn: '30d'})

          const newUserData = {
               id: rawData._id,
               username: rawData.username,
               email: rawData.email,
               gender: rawData.gender
          }
          res.send({token, data: newUserData})
          console.log("User signed up success...")
          console.log(rawData)
     } catch(err) {
          console.log(err)
          res.status(406).send({ message: 'Username not available.', reason: "Username already in use."})
     }
})


module.exports = route