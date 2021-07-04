const route = require('express').Router()
const { signIn } = require('../controller/auth')

// Handle when url -> /signin 
route.get('/', signIn)


module.exports = route