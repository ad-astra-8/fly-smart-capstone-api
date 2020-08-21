const path = require('path')
const express = require('express')
const xss = require('xss')
const ChecklistService = require('./checklist-service')
const { response } = require('express')

const checklistRouter = express.Router()
const jsonParser = express.json()

const serializeChecklist = item => ({
  id: item.id,
  item: xss(item.item),
  completed: item.completed
})

checklistRouter
.route('/')
.get((req, res, next)=>{
  const KnexInstance = req.app.get('db')
  ChecklistService.getChecklists(KnexInstance)
  .then(checklist=>{
    res.json(checklist.map(serializeChecklist))
  })
  .catch(next)
})

.post(jsonParser, (req, res, next)=>{
  const {item, completed = false} = req.body
  const newChecklist = {item}
  for (const [key, value] of Object.entries(newChecklist))
  if (value == null)
  return res.status(400).json({
    error: {message: `missing ${key} in request body`}
  })

  newChecklist.completed = completed;
  ChecklistService.insertChecklist(
    req.app.get('db'),
    newChecklist
  )

  .then(checklist=>{
    res
    .status(201)
    .location(path.posix.join(req.originalUrl, `/${item_id}`))
    .json(serializeChecklist(checklist))
  })
  .catch(next)
})
checklistRouter
  .route('/:item_id')
  .all((req, res, next) => {
    if (isNaN(parseInt(req.params.item_id))) {
      return res.status(404).json({
        error: { message: `Invalid id, ${req.params.item_id}` }
      })
    }
    ChecklistService.getChecklistById(
      req.app.get('db'),
      req.params.item_id
    )
      .then(checklist => {
        if (!checklist) {
          return res.status(404).json({
            error: { message: `Item doesn't exist` }
          })
        }
        res.checklist = checklist
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeChecklist(res.checklist))
  })
  .delete((req, res, next) => {
    ChecklistService.deleteChecklist(
      req.app.get('db'),
      req.params.item_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { id, item, completed } = req.body
    const checklistToUpdate = { id, item, completed }

    const numberOfValues = Object.values(checklistToUpdate).filter(Boolean).length
    if (numberOfValues == 0)
      return res.status(400).json({
        error: {
          message: `Request body must content either 'item' or 'completed'`
        }
      })

    ChecklistService.updateChecklist(
      req.app.get('db'),
      req.params.item_id,
      checklistToUpdate
    )
      .then(updatedChecklist => {
        res.status(200).json(serializeChecklist(updatedChecklist[0]))
      })
      .catch(next)
  })

module.exports = checklistRouter