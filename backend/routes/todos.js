const express = require('express');
const {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo
} = require('../controllers/todoController');
const auth = require('../middleware/auth');
const {
  createTodoValidation,
  updateTodoValidation,
  queryValidation
} = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(auth);

router.route('/')
  .get(queryValidation, getTodos)
  .post(createTodoValidation, createTodo);

router.route('/:id')
  .get(getTodo)
  .put(updateTodoValidation, updateTodo)
  .delete(deleteTodo);

router.patch('/:id/toggle', toggleTodo);

module.exports = router;