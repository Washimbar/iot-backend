const express = require("express");
const {
    getTodo,
    getTodoById,
	createTodo,
	updateTodo,
	deleteTodo,
} = require("../controllers");

const todoRoute = express.Router();

todoRoute.get("/getTodo", getTodo);
todoRoute.get("/getTodoById/:id", getTodoById);
todoRoute.post("/createTodo", createTodo);
todoRoute.put("/updateTodo/:id", updateTodo);
todoRoute.delete("/deleteTodo/:id", deleteTodo);

module.exports = todoRoute;
