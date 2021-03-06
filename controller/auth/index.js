const jwt = require('jsonwebtoken')
const Users = require('../../models/user.model')

exports.signIn = async function(req, res) {
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')
     console.log(`---> Route Hit: ${req.originalUrl}`)
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')

     const { authorization } = req.headers
     let token
     
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
}