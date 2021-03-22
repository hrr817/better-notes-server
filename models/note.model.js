const mongoose = require('mongoose')

let noteSchema = require('../schemas/noteSchema')

const Note = mongoose.model('entry', noteSchema)

module.exports = Note