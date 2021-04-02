const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const URL_PRIVATE = require('./uri')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 9000 

app.use(cors())
app.use(express.json())

mongoose.connect(URL_PRIVATE, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})

const connection = mongoose.connection;

connection.once('open', function() {
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')
     console.log('---> Mongodb connection established to', '\x1b[32m', `${process.env.ATLAS_URI}.\nsuccessfully.`, '\x1b[0m')
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')
})

// Route for signIn
app.use('/auth', require('./routes/auth'))

// Route for signIn
app.use('/signin', require('./routes/signIn'))

// Route for signIn
app.use('/signup', require('./routes/signUp'))

// Route for users
app.use('/users', require('./routes/users'))

// Route for user (information)
app.use('/user', require('./routes/user'))

// Route for notes
app.use('/notes', require('./routes/notes'))

// Route for /
app.get('/', function(req, res) {
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')
     console.log(`---> Route Hit: ${req.originalUrl}`)
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')
     
     res.json("Server working fine...")
})

app.listen(port, function() {
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')
     console.log('---> Server started running on ', '\x1b[32m', `http://localhost:${port}`, '\x1b[0m')
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')
})