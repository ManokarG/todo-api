const _ = require('underscore');

module.exports=function(db,express){
	var router=express.Router();

	router.get("/",function(req, res) {

	var where = {};
	where.userId=req.user.get('id');

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

	router.get('/:id', function(req, res) {

	var response = {};

	const todoId = parseInt(req.params.id, 10);

	db.todo.findOne({
		where:{
			id:todoId,
			userId:req.user.get('id')
		}
	}).then(function(todo) {
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

	router.post('/', function(req, res) {

	const response = {};

	const todo = _.pick(req.body, 'completed', 'description');

	db.todo.create(todo).then(function(todo) {
		req.user.addTodo(todo).then(function(){
			return todo.reload();
		}).then(function(todo){
			res.json(todo.toJSON());
		});
	}).catch(function(e) {
		return res.status(400).send();
	});
});

router.delete('/:id', function(req, res) {

	const id = parseInt(req.params.id, 10);
	db.todo.destroy({
		where: {
			id: id,
			userId:req.user.get('id')
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

router.put('/:id', function(req, res) {

	const todoId = parseInt(req.params.id, 10);
	var data = {};
	const body = _.pick(req.body, 'description', 'completed');

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		data.completed = body.completed;
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		data.description = body.description;
	}

	db.todo.findOne({
		where:{
			id:todoId,
			userId:req.user.get('id')
		}
	}).then(function(todo) {
		return todo.update(data);
	}, function(e) {
		res.json({
			status: "error",
			message: "No todo found"
		});
	}).then(function(todo) {
		res.json({
			status: "success",
			todo: todo
		});
	}, function(e) {
		res.json({
			status: "error",
			message: "No todo found"
		});
	});

});

	return router;
}