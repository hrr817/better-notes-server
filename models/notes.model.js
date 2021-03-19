const mongoose = require('mongoose')
const Schema = mongoose.Schema

const noteSchema = new Schema({
     id: {
          type: String,
          required: true,
          unique: true,
     },
     notes: {
          type: Object
     }
}, {
     timestamps: true
})

const Notes = mongoose.model('Notes', noteSchema, 'notes')

module.exports = Notes