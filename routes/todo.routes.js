import express from "express";
import { createTodo, getTodos, getTodoById, updateTodoById, toggleTodo, deleteTodo } from "../controllers/todo.controllers.js";

const route = express.Router();

// route.get('/', (req, res) => {
//     res.send("Todo app is running");
// });

route.post('/add', createTodo);
route.get('/', getTodos);
route.get('/:id', getTodoById);
route.put('/:id', updateTodoById);
route.patch('/:id/toggle', toggleTodo);
route.delete('/:id', deleteTodo);

export default route;