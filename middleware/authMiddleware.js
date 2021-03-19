const jwt = require('jsonwebtoken')
const users = require('../models/users.model')

async function authMiddleware(req, res, next) {
     let token
     let userData

     const { authorization } = req.headers

     if(authorization && authorization.startsWith('Bearer')){
          try {
               token = authorization.split(' ')[1]
               const secretData = jwt.verify(token, process.env.AUTH_KEY)
               
               userData = await users.findById(secretData.id)
               next()
          } catch(err) {
               res.status(401).send("Invalid token")
               console.error('Invalid Token')
               console.error(error)
          }
     }

     if(!token){
          res.status(401).send("Not authorized")
          console.error('not authorized Token')
     }
}

module.exports = authMiddleware 