const NoteService = {
    getNotes(db) {
      return db
        .from('note')
        .select(
          'note.id',
          'note.title',
          'note.completed',
        )
    },
    getNoteById(db, note_id) {
      return db
        .from('note')
        .select(
          'note.id',
          'note.title',
          'note.completed',
        )
        .where('note.id', note_id)
        .first()
    },
    insertNote(db, newNote) {
      return db
        .insert(newNote)
        .into('note')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    deleteNote(db, note_id) {
      return db('note')
        .where({'id': note_id})
        .delete()
    },
    updateNote(db, note_id, newNote) {
      return db('note')
        .where({id: note_id})
        .update(newNote, returning=true)
        .returning('*')
    }
  
  }
  
  module.exports = NoteService