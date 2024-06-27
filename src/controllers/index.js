const {
    getTodo,
    getTodoById,
	createTodo,
	updateTodo,
	deleteTodo,
} = require("./todo.controller");
module.exports = { getTodo, getTodoById, createTodo, updateTodo, deleteTodo };
