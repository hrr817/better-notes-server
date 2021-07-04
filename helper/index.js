const jwt = require('jsonwebtoken')

var helpers = {}

helpers.verifyToken = function(authorization) {
   const token = authorization.split(' ')[1]
   return jwt.verify(token, process.env.AUTH_KEY)
}

helpers.printRoute = function(originalUrl) {
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')
     console.log(`---> Route Hit: ${originalUrl}`)
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')
}

module.exports = helpers