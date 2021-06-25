const route = require('express').Router()
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const protect = require('../middleware/authMiddleware')
let Entry = require('../models/entry.model')
let Note = require('../models/note.model');

// Handle when url -> /notes 
route.get('/', protect, async function (req, res) {
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')
     console.log(`---> Route Hit: ${req.originalUrl}`)
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')

     const { authorization } = req.headers
     let token = authorization.split(' ')[1]
     const secretData = jwt.verify(token, process.env.AUTH_KEY)

     if(secretData.id) {
          try {
               const { notes } = await Entry.findById(secretData.id).exec()
               // console.log(notes)
               res.json(notes)
          } catch(err) {
               console.log(err)
          }
     }
})

// Handle when url -> /notes/:id
route.get('/:id',  async function(req, res) {
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')
     console.log(`---> Route Hit: ${req.originalUrl}`)
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')

     const noteId = req.params.id

     if(noteId) {
          try {
               const { notes } = await Entry.findOne({ 'notes._id': noteId })
               const requestedNote = _.filter(notes, o => o._id == noteId)[0]

               const { authorization } = req.headers
               let token = authorization.split(' ')[1] 
               const { id } = jwt.verify(token, process.env.AUTH_KEY)

               const { private, author } = requestedNote

               if(private && author.id !== id) {
                    res.status(403).json(
                         { message : "Author has not made the document public.", reason: "Document is private."}
                    )
               } 

               res.json(requestedNote)
          } catch(err) {
               res.status(404).json({ message : "No note found", reason: "Invalid note id"})
          }
     }
})

// Handle when url -> /notes/create 
route.post('/create', protect, async function(req, res) {
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')
     console.log(`---> Route Hit: ${req.originalUrl}`)
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')

     const { note, author } = req.body

     console.log(req.body)
     const newNote = new Note({
          note,
          author
     })

     console.log(newNote)

     try {
          if(note && author) {
               const data = await Entry.findByIdAndUpdate(author.id, { "$push": { notes: newNote } }, { new: true })
               // console.log(data)
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

     if(noteId && userId) {
          const newData = {}

          _.forIn(data, function(val, key) {
               newData[`notes.$[elem].${key}`] = val
          })

          try {
               const data = await Entry.findOneAndUpdate({ '_id': userId, 'notes._id': noteId }, 
                    { '$set': newData },
                    {
                         new: true,
                         arrayFilters: [{ 'elem._id': noteId }],
                         useFindAndModify: false
                    }
               )

               console.log(data)

               res.json(data)

               // const data = await Entry.findByIdAndUpdate(userId, 
               // { '$set': newData },
               // {
               //      new: true,
               //      arrayFilters: [{ 'elem._id': noteId }]
               // })
               // res.send(data)
          } catch(err) {
               console.log(err)
               res.status(404).json({ message: 'Unable to update note', reason: 'Not found'})
          }
     }
})

// Handle when url -> /notes/:id/delete
route.post('/:id/delete', protect, async function deleteNoteById(req, res) {
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')
     console.log(`---> Route Hit: ${req.originalUrl}`)
     console.log('\x1b[33m' ,'--------------------------------------------------------------------------', '\x1b[0m')

     const { authorization } = req.headers
     let token = authorization.split(' ')[1]
     const secretData = jwt.verify(token, process.env.AUTH_KEY)

     const userId = secretData.id
     const noteId = req.params.id

     if(noteId && userId) {
          try {
               const data = await Entry.findByIdAndUpdate(userId, 
               { '$pull': { notes: {'_id': noteId } } },
               {
                    new: true,
               })
               res.json(data)
          } catch(err) {
               console.log(err)
               res.status(404).json({ message: 'Unable to delete note', reason: 'Not found'})
          }
     }
})

module.exports = route