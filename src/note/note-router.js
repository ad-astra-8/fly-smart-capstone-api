const path = require('path')
const express = require('express')
const xss = require('xss')
const NoteService = require('./note-service')
const { response } = require('express')

const noteRouter = express.Router()
const jsonParser = express.json()

const serializeNote = note => ({
  id: note.id,
  note: xss(note.note),
  completed: note.completed
})

noteRouter
.route('/')
.get((req, res, next)=>{
  const KnexInstance = req.app.get('db')
  NoteService.getNotes(KnexInstance)
  .then(notes=>{
    res.json(notes.map(serializeNote))
  })
  .catch(next)
})

.post(jsonParser, (req, res, next)=>{
  // const {user_id, note, completed = false} = req.body
  // const newNote = {user_id, note, completed}
  const { note, completed = false} = req.body
  const newNote = { note, completed }

  for (const [key, value] of Object.entries(newNote))
  if (value == null)
  return res.status(400).json({
    error: {message: `missing ${key} in request body`}
  })

  newNote.completed = completed;
  NoteService.insertNote(
    req.app.get('db'),
    newNote
  )

  .then(note=>{
    res
    .status(201)
    .location(path.posix.join(req.originalUrl, `/my-list`))
    .json(serializeNote(note))
  })
  .catch(next)
})
noteRouter
  .route('/:id')
  .all((req, res, next) => {
    if (isNaN(parseInt(req.params.id))) {
      return res.status(404).json({
        error: { message: `Invalid id` }
      })
    }
    NoteService.getNoteById(
      req.app.get('db'),
      req.params.id
    )
      .then(note => {
        if (!note) {
          return res.status(404).json({
            error: { message: `Note doesn't exist` }
          })
        }
        res.note = note
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeNote(res.note))
  })
  .delete((req, res, next) => {
    NoteService.deleteNote(
      req.app.get('db'),
      req.params.id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { note, completed } = req.body
    const noteToUpdate = { note, completed }

    const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must content either 'note' or 'completed'`
        }
      })

    NoteService.updateNote(
      req.app.get('db'),
      req.params.id,
      noteToUpdate
    )
      .then(updatedNote => {
        res.status(200).json(serializeNote(updatedNote[0]))
      })
      .catch(next)
  })

module.exports = noteRouter