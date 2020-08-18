const ChecklistService = {
    getChecklists(db) {
      return db
        .from('checklist')
        .select("*")
    },
    getChecklistById(db, item_id) {
      return db
        .from('checklist')
        .select("*")
        .where('checklist.id', item_id)
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
    deleteChecklist(db, item_id) {
      return db('checklist')
        .where({'id': item_id})
        .delete()
    },
    updateChecklist(db, item_id, newChecklist) {
      return db('checklist')
        .where({id: item_id})
        .update(newChecklist, returning=true)
        .returning('*')
    }
  
  }
  
  module.exports = ChecklistService