const route = require('express').Router()
const jwt = require('jsonwebtoken')

let Users = require('../models/users.model')

// Handle when url -> /signin 
route.get('/', async function(req, res) {
     // do something over here
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')
     console.log(`---> Route Hit: /auth`)
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')

     let token

     const { authorization } = req.headers
     try {
          token = authorization.split(' ')[1]
          const secretData = jwt.verify(token, process.env.AUTH_KEY)
          userData = await Users.findById(secretData.id).select('-password')
          res.send(userData)
     } catch(err) {
          res.status(401).send("Invalid token")
          console.error('Invalid Token')
          console.error(error)
     }

     if(!token){
          res.status(401).send("Not authorized")
          console.error('not authorized Token')
     }
})


module.exports = route