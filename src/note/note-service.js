const NoteService = {
    getNotes(db) {
      return db
        .from('notes')
        .select("*")
    },
    getNoteById(db, note_id) {
      return db
        .from('notes')
        .select("*")
        .where({'id': note_id})
        .first()
    },
    insertNote(db, newNote) {
      return db
        .insert(newNote)
        .into('notes')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    deleteNote(db, note_id) {
      return db('notes')
        .where({'id': note_id})
        .delete()
    },
    updateNote(db, note_id, newNote) {
      return db('notes')
        .where({'id': note_id})
        .update(newNote, returning=true)
        .returning('*')
    }
  
  }
  
  module.exports = NoteService