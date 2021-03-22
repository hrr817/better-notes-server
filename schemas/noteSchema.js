const mongoose = require('mongoose')
const Schema = mongoose.Schema

const noteSchema = new Schema({
     title: {
          type: String,
          default: ''
     },
     note: {
          type: String,
          required: true,
     },
     archived: {
          type: Boolean,
          default: false
     },
     author: {
          type: String,
          required: true
     },
     private: {
          type: Boolean,
          default: true
     }
}, {
     timestamps: true
})

module.exports = noteSchema