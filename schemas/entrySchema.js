const mongoose = require('mongoose')
const Schema = mongoose.Schema

const noteSchema = require('../schemas/noteSchema')

const entrySchema = new Schema({
     _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'User'
     },
     notes: [noteSchema]
}, {
     timestamps: true
})

module.exports = entrySchema