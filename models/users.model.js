const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
     username: {
          type: String,
          required: true,
          unique: true,
          trim: true,
          minlength: 3,
          maxLength: 15
     },
     password: {
          type: String,
          required: true,
          minlength: 8,
          maxLength: 15
     },
     email: {
          type: String,
          required: true,
          maxLength: 20
     },
     gender: {
          type: String,
          maxLength: 10
     },
}, {
     timestamps: true
})

const User = mongoose.model('Users', userSchema, 'users')

module.exports = User