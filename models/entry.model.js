const mongoose = require('mongoose')

let entrySchema = require('../schemas/entrySchema')

const Notes = mongoose.model('Notes', entrySchema)

module.exports = Notes