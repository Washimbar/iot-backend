const { TodoModel } = require("../models");

const getTodo = async (req, res) => {
	try {
		const todos = await TodoModel.find();
		res.status(200).send({ todos });
	} catch (error) {
		res.status(500).error(error.message);
	}
};
const getTodoById = async (req, res) => {
	try {
		const todos = await TodoModel.findById(req.params.id);
		res.status(200).send(todos);
	} catch (error) {
		res.status(500).error(error.message);
	}
};

const createTodo = async (req, res) => {
    try {
        const todo = new TodoModel(req.body)
        const newTodo = await todo.save();
		res.status(201).send(newTodo);
	} catch (error) {
		res.status(500).error(error.message);
	}
};

const updateTodo = async (req, res) => {
    try {
        const updatedTodo = await TodoModel.findByIdAndUpdate(req.params.id, req.body, {new: true});
		res.status(200).send(updatedTodo);
	} catch (error) {
		res.status(500).error(error.message);
	}
};

const deleteTodo = async (req, res) => {
    try {
        const deletedTodo = await TodoModel.findByIdAndDelete(req.params.id);
		res.status(200).send(deletedTodo);
	} catch (error) {
		res.status(500).error(error.message);
	}
};

module.exports = {
    getTodo,
    getTodoById,
	createTodo,
	updateTodo,
	deleteTodo,
};
