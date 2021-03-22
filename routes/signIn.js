const route = require('express').Router()
const tokenGenerator = require('jsonwebtoken')

let User = require('../models/user.model')

// Handle when url -> /signin 
route.post('/', function(req, res) {
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')
     console.log(`---> Route Hit: ${req.originalUrl}`)
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')

     const email = req.body.email
     const password = req.body.password

     User.findOne({ email, password }, function(err, user) {
          if(!user) res.status(400).json({message: "Invalid email or password.", reason: "No account found with the given combination of email and password."})

          if(user) {
               const token = tokenGenerator.sign({ id: user._id }, process.env.AUTH_KEY, { expiresIn: '30d'})

               const userData = {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    gender: user.gender
               }

               res.json({ token, data: userData })
          }
     } )
})


module.exports = route