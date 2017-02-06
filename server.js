`use strict`

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('underscore');
const db=require('./db.js');
const app = express();
const PORT = process.env.PORT || 8888;

var todoNextId = 5;

app.use(bodyParser.json());

var todos = [{
    id: 1,
    description: "http://www.google.com",
    completed: true
}, {
    id: 2,
    description: "http://www.yahoo.com",
    completed: false
}, {
    id: 3,
    description: "http://www.youtube.com",
    completed: true
}, {
    id: 4,
    description: "http://www.facebook.com",
    completed: false
}]

app.get('/', function (req, res) {
    res.send("Todo API root detected");
});

app.get('/todos', function(req, res) {

    /*var filterTodo = todos;

    var query = req.query;

    if (query.hasOwnProperty('completed')) {
        if (query.completed === 'true') {
            filterTodo = _.where(todos, {
                completed: true
            });
        } else {
            filterTodo = _.where(todos, {
                completed: false
            });
        }
    }

    if (query.hasOwnProperty('q')) {
        filterTodo = _.filter(filterTodo, function(todo) {
            return todo.description.toLowerCase().indexOf(query.q.toLowerCase()) > -1;
        });
    }
*/

db.todo.findAll().then(function(todos){
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

    var matchedTodo = _.findWhere(todos, {
        id: todoId
    });

    if (matchedTodo) {
        response.status = "success";
        response.todo = matchedTodo;
    } else {
        response.status = "error";
        response.todo = {};
        res.status(404);
    }

    res.json(response);

});

app.post('/todo', function(req, res) {

    const response = {};

    const todo = _.pick(req.body, 'completed', 'description');

    db.todo.create(todo).then(function(todo){
        res.json(todo.toJSON());
    }).catch(function(e){
        return res.status(400).send();
    });

    /*if (!_.isBoolean(todo.completed) || !_.isString(todo.description) || todo.description.trim().length === 0) {
        return res.status(400).send();
    }

    todo.description = todo.description.trim();

    todo.id = todoNextId;
    todos.push(todo);
    todoNextId = todoNextId + 1;
    response.status = 'success';
    response.todo = todo;
    res.json(response);*/

});

app.delete('/todo/:id', function(req, res) {

    const id = parseInt(req.body.id, 10);
    const matchedTodo = _.findWhere(todos, {
        id: id
    });

    if (!matchedTodo) {
        res.status(400).send({
            "error": "No todo found with the id."
        });
    } else {
        todos = _.without(todos, matchedTodo);
        res.json(todos);
    }

});

app.put('/todo/:id', function(req, res) {

    const todoId = parseInt(req.params.id, 10);
    const matchedTodo = _.findWhere(todos, {
        id: todoId
    });
    const body = _.pick(req.body, 'description', 'completed');
    var validAttributes = {};

    if (!matchedTodo) {
        return res.status(400).send('No matched todo');
    }

    if (matchedTodo.hasOwnProperty('completed') && _.isBoolean(matchedTodo.completed)) {
        validAttributes.completed = body.completed;
    } else if (matchedTodo.hasOwnProperty('completed')) {
        return res.status(400).send('No completed args');
    }

    if (matchedTodo.hasOwnProperty('description') && _.isString(matchedTodo.description) && matchedTodo.description.trim().length > 0) {
        validAttributes.description = body.description;
    } else if (matchedTodo.hasOwnProperty('description')) {
        return res.status(400).send('No description args');
    }


    _.extend(matchedTodo, validAttributes);

    res.json(matchedTodo);
});

db.sequelize.sync().then(function(){
app.listen(PORT, function() {
    console.log(` Server listening on port ${PORT}`);
});
});
