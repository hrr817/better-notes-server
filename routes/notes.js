const route = require('express').Router()
const _ = require('lodash')
const { response } = require('express');
const jwt = require('jsonwebtoken')
const protect = require('../middleware/authMiddleware')
let Entry = require('../models/entry.model')
let Note = require('../models/note.model')

// Handle when url -> /notes 
route.get('/', protect, async function(req, res) {
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')
     console.log(`---> Route Hit: ${req.originalUrl}`)
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')

     const { authorization } = req.headers
     let token = authorization.split(' ')[1]
     const secretData = jwt.verify(token, process.env.AUTH_KEY)

     if(secretData.id) {
          try {
               const { notes } = await Entry.findById(secretData.id).exec()
               console.log(notes)
               res.json(notes)
          } catch(err) {
               console.log(err)
          }
     }

})

// Handle when url -> /notes/:id
route.get('/:id', protect, async function(req, res) {
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')
     console.log(`---> Route Hit: ${req.originalUrl}`)
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')

     const noteId = req.params.id

     const { authorization } = req.headers
     let token = authorization.split(' ')[1]
     const secretData = jwt.verify(token, process.env.AUTH_KEY)

     const userId = secretData.id

     if(noteId && userId) {
          try {
               const { notes } = await Entry.findById(userId).exec()

               const found = _.filter(notes, o => o._id == noteId)

               if(found.length) {
                    res.json(found[0])
               } else {
                    res.status(404).json({ message : "No note found", reason: "Invalid note id"})
               }
          } catch(err) { 
               res.status(404).json({ message : "User stash not found", reason: "Invalid user id"})
          }


     }

})

// Handle when url -> /notes/create 
route.post('/create', protect, async function(req, res) {
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')
     console.log(`---> Route Hit: ${req.originalUrl}`)
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')

     const { note, author } = req.body
     const newNote = new Note({
          note,
          author
     })

     try {
          if(note && author) {
               const data = await Entry.findByIdAndUpdate(author.id, { "$push": { notes: [newNote] } }, { new: true })
               console.log(data)
               res.send(data)
          }
     } catch(err) {
          console.log(err)
     }
})


// Handle when url -> /notes/:id/update
route.post('/:id/update', protect, async function(req, res) {
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')
     console.log(`---> Route Hit: ${req.originalUrl}`)
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')

     const { authorization } = req.headers
     let token = authorization.split(' ')[1]
     const secretData = jwt.verify(token, process.env.AUTH_KEY)

     const userId = secretData.id
     const noteId = req.params.id
     const data = req.body

     console.log(data)

     if(noteId && userId) {
          const newData = {}

          _.forIn(data, function(val, key) {
          newData[`notes.$.${key}`] = val
          })
     
          console.log(newData)

          Entry.updateOne({'notes._id': noteId}, {'$set': newData}, { new: true, multipleCastError: true }, function(err, done) {
               if(!done) res.status(503).json({ message: 'Unable to update note', reason: 'Not found'})
               res.json(done)
          })
     }
})

module.exports = route