const route = require('express').Router()
const protect = require('../middleware/authMiddleware')

const { getNotes, getNoteById, createNote, updateNoteById, deleteNoteById } = require('../controller/notes')

// Handle when url -> /notes 
route.get('/', protect, getNotes)

// Handle when url -> /notes/:id
route.get('/:id', getNoteById)

// Handle when url -> /notes/create 
route.post('/create', protect, createNote)


// Handle when url -> /notes/:id/update
route.post('/:id/update', protect, updateNoteById)

// Handle when url -> /notes/:id/delete
route.post('/:id/delete', protect, deleteNoteById)

module.exports = route