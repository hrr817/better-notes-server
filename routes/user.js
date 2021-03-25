const route = require('express').Router()
let User = require('../models/user.model')
let auth = require('../middleware/authMiddleware')

// Handle when url -> /user
route.get('/:username', async function(req, res, next) {
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')
     console.log(`---> Route Hit: ${req.originalUrl}`)
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')

     const { username } = req.params
     try {
          const user = await User.findOne({ username }, '-password -__v' ).exec()
          if(!user){
               res.status(404).json({ message: `Could not find the person with ${username} username.`, reason: `No person in database with ${username} username`})
          }

          auth(req, res, next)

          res.status(200).json(user)
          console.log(`User found, data sent`)
          console.log(`Data: ${user}`)
     } catch(err) {
          console.log(err)
     }
})

module.exports = route