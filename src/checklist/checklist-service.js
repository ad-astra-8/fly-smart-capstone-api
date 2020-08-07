const ChecklistService = {
    getChecklists(db) {
      return db
        .from('checklist')
        .select(
          'checklist.id',
          'checklist.title',
          'checklist.completed',
        )
    },
    getChecklistById(db, checklist_id) {
      return db
        .from('checklist')
        .select(
          'checklist.id',
          'checklist.title',
          'checklist.completed',
        )
        .where('checklist.id', checklist_id)
        .first()
    },
    insertChecklist(db, newChecklist) {
      return db
        .insert(newChecklist)
        .into('checklist')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    deleteChecklist(db, checklist_id) {
      return db('checklist')
        .where({'id': checklist_id})
        .delete()
    },
    updateChecklist(db, checklist_id, newChecklist) {
      return db('checklist')
        .where({id: checklist_id})
        .update(newChecklist, returning=true)
        .returning('*')
    }
  
  }
  
  module.exports = ChecklistService