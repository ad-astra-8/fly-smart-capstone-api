//loading external resources
const path = require('path')
const express = require('express')
const xss = require('xss')
//include service and validator
const NoteService = require('./note-service')

const { response } = require('express')

//define noteRouter and jsonParser for reuse
const noteRouter = express.Router()
const jsonParser = express.json()

//serialization method to display selective data related to notes
const serializeNote = note => ({
  id: note.id,
  note: xss(note.note),
  completed: note.completed
})

//routes
noteRouter
  .route('/')
  //get all notes
  .get((req, res, next) => {
    const KnexInstance = req.app.get('db')
    NoteService.getNotes(KnexInstance)
      .then(notes => {
        res.json(notes.map(serializeNote))
      })
      .catch(next)
  })

  //post new note
  .post(jsonParser, (req, res, next) => {
    const { note, completed = 0 } = req.body
    const newNote = { note, completed }

    //validating the fields we send accross
    for (const [key, value] of Object.entries(newNote))
      if (value == null)
        return res.status(400).json({
          error: { message: `missing ${key} in request body` }
        })

    //sending data to service in order to save data in db
    newNote.completed = completed;
    NoteService.insertNote(
      req.app.get('db'),
      newNote
    )

      .then(note => {
        const notePath = path.posix.join(req.originalUrl, `/${note.id}`);
        const serializedNote = serializeNote(note);
        res
        .status(201)
        .location(notePath)
        .json(serializedNote)
      })
      .catch(error => {
    console.log(error);
    next(error);
})
  })

//routes by id
noteRouter
  .route('/:note_id')
  .all((req, res, next) => {
    if (isNaN(parseInt(req.params.note_id))) {
      return res.status(404).json({
        error: { message: `Invalid id ${req.params.note_id}` }
      })
    }
    NoteService.getNoteById(
      req.app.get('db'),
      req.params.note_id
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

  //get notes by id
  .get((req, res) => {
    res.json(serializeNote(res.note));
  })
  //delete note by id
  .delete((req, res, next) => {
    console.log("DEMO");
    console.log(req.params.note_id);
    NoteService.deleteNote(
      req.app.get('db'),
      req.params.note_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = noteRouter