const mongoose = require('mongoose')

let userSchema = require('../schemas/userSchema')

const User = mongoose.model('Users', userSchema)

module.exports = User