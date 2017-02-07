const express = require('express');
const bodyParser = require('body-parser');
const _ = require('underscore');
const db = require('./db.js');
const app = express();
const PORT = process.env.PORT || 8888;

var todoNextId = 5;

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send("Todo API root detected");
});

app.get('/todos', function(req, res) {

	var where = {};

	var query = req.query;

	if (query.hasOwnProperty('completed')) {
		if (query.completed === 'true') {
			where.completed = true;
		} else {
			where.completed = false;
		}
	}

	if (query.hasOwnProperty('q')) {
		where.description = {
			$like: '%' + query.q.toLowerCase() + '%'
		};
	}


	db.todo.findAll({
		where
	}).then(function(todos) {
		var todo = {
			status: "success",
			todos: todos
		}

		res.json(todo);
	});

});

app.get('/todo/:id', function(req, res) {

	var response = {};

	const todoId = parseInt(req.params.id, 10);

	db.todo.findById(todoId).then(function(todo) {
		if (todo) {
			response.status = "success";
			response.todo = todo;
		} else {
			response.status = "error";
			response.todo = {};
			res.status(404);
		}

		res.json(response);
	}).catch(function(e) {
		response.status = "error";
		response.todo = {};
		res.status(404).json(response);
	});

});

app.post('/todo', function(req, res) {

	const response = {};

	const todo = _.pick(req.body, 'completed', 'description');

	db.todo.create(todo).then(function(todo) {
		res.json(todo.toJSON());
	}).catch(function(e) {
		return res.status(400).send();
	});
});

app.delete('/todo/:id', function(req, res) {

	const id = parseInt(req.params.id, 10);
	db.todo.destroy({
		where: {
			id: id
		}
	}).then(function(count) {

		if (count == 0) {
			res.status(404).json({
				status: 'error',
				message: 'No todos removed'
			});
		} else {
			res.json({
				status: 'success',
				message: `${count} todos removed`
			});
		}
	}).catch(function(e) {
		res.status(404).json({
			status: 'error',
			message: 'No todos removed'
		});
	});

});

app.put('/todo/:id', function(req, res) {

	const todoId = parseInt(req.params.id, 10);
	var data = {};
	const body = _.pick(req.body, 'description', 'completed');

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		data.completed = body.completed;
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		data.description = body.description;
	}

db.todo.findById(todoId).then(function(todo){
	return todo.update(data);
},function(e){
	res.json({
		status:"error",
		message:"No todo found"
	});
}).then(function(todo){
	res.json({
		status:"success",
	todo:todo	
	});
},function(e){
res.json({
		status:"error",
		message:"No todo found"
	});
});

});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log(` Server listening on port ${PORT}`);
	});
});