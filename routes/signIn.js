const route = require('express').Router()
const tokenGenerator = require('jsonwebtoken')

let User = require('../models/user.model')

// Handle when url -> /signin 
route.post('/', async function(req, res) {
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')
     console.log(`---> Route Hit: ${req.originalUrl}`)
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')

     const email = req.body.email
     const password = req.body.password

     try {
          const user = await User.findOne({ email, password }, '-password -__v' ).exec()
          const token = tokenGenerator.sign({ id: user._id }, process.env.AUTH_KEY, { expiresIn: '30d'})

          res.json({ token, data: user })
     } catch(err) {
          console.log(err)
          res.status(400).json({message: "Invalid email or password.", reason: "No account found with the given combination of email and password."})
     }
})


module.exports = route