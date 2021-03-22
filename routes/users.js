const route = require('express').Router()
let User = require('../models/user.model')
const protect = require('../middleware/authMiddleware')

// Handle when url -> /users 
route.get('/', protect, function(req, res) {
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')
     console.log(`---> Route Hit: /users`)
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')

     console.log(req.body)

     User.find()
     .then(users => res.json(users))
     .catch(err => console.log(err))
})

// Handle when url -> /users/delete
route.post('/delete', function(req, res) {
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')
     console.log(`---> Route Hit: /users/delete`)
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')
     
     const username = req.body.username
     const password = req.body.password;

     User.deleteOne({ username, password })
     .then(() => res.json('User deleted'))
     .catch(err => res.status(400).json('Error: ' + err))
})

module.exports = route