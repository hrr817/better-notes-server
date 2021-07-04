const jwt = require('jsonwebtoken')
const _ = require('lodash')
const Entry = require('../../models/entry.model')
const Note = require('../../models/note.model');

// helpers 
const { verifyToken, printRoute } = require('../../helper')

exports.getNotes = async function (req, res) {
   printRoute(req.originalUrl)
   const secretData = verifyToken(req.headers.authorization)

   if(secretData.id) {
         try {
            const { notes } = await Entry.findById(secretData.id).exec()
            res.json(notes)
         } catch(err) {
            console.log(err)
         }
   }
}

exports.getNoteById = async function(req, res) {
   printRoute(req.originalUrl)

   const noteId = req.params.id

   if(noteId) {
      try {
         const { notes } = await Entry.findOne({ 'notes._id': noteId })
         const requestedNote = _.filter(notes, o => o._id == noteId)[0]

         const { id } = verifyToken(req.headers.authorization)

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
}

exports.createNote = async function(req, res) {
   printRoute(req.originalUrl)

   const { note, author } = req.body

   const newNote = new Note({ note, author })

   try {
      if(note && author) {
         const data = await Entry.findByIdAndUpdate(author.id, { "$push": { notes: newNote } }, { new: true })
         res.send(data)
      }
   } catch(err) {
      console.log(err)
   }
}

exports.updateNoteById = async function(req, res) {
   printRoute(req.originalUrl)

   const secretData = verifyToken(req.headers.authorization)

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

         res.json(data)
      } catch(err) {
         console.log(err)
         res.status(404).json({ message: 'Unable to update note', reason: 'Not found'})
      }
   }
} 


exports.deleteNoteById = async function deleteNoteById(req, res) {
   printRoute(req.originalUrl)

   const secretData = verifyToken(req.headers.authorization)

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
         res.status(404).json({ message: 'Unable to delete note', reason: 'Not found'})
      }
   }
}