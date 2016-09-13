var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore'); 

var app = express();
var PORT = process.env.PORT || 3000;

var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('Todo API root'); 
});


// GET /todos
app.get('/todos', function (req, res) {
	res.json(todos);
});
// GET /todos/:id
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

    if (matchedTodo) {
    	res.json(matchedTodo);
    	return; 
    } else {
		// send a 404, since we didn't return. 
		res.status(404).send("error:", "no todo found with that id"); 
    }
});

// POST /todos
app.post('/todos', function(req, res) {
	console.log('start todos');
	var body = req.body;
	// use _.pick to only pick description and completed. 
	body = _.pick(body, 'description', 'completed');
console.log('got here 1');
	// do validation
	if (!_.isBoolean(body.completed)  || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}

    // set body.description to the trimmed value. 
    body.description = body.description.trim(); 
console.log('got here 2');
	// add id field
	body.id = todoNextId++;

	console.log('got here');
	// push body to array
	todos.push(body);
	console.log(body.description); 
	res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

    console.log('in delete'); 
    if (matchedTodo) {
    	console.log("Deleting /todos " + matchedTodo); 
		var newTodos = _.without(todos, matchedTodo);
		todos = newTodos; 
    	res.json(matchedTodo);
    	return; 
    } else {
		// send a 404, since we didn't return. 
		res.status(404).send(); 
    }
});

// PUT  /todos/:id
app.put('/todos/:id', function(req, res) {
    console.log("entering put"); 
    var body = req.body;
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	body = _.pick(body, 'description', 'completed');
	var validAttributes = {}; 

console.log("input: " + body.description + ", " + body.completed); 


	
	if (!matchedTodo) {
		return res.status(404).send(); 
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed; 
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send(); 
	} 

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description; 
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send(); 
	} 

    console.log( "before: " + matchedTodo.completed); 
    console.log("validAttributes: " + validAttributes.description + ", " + validAttributes.completed);
	// Here
	matchedTodo = _.extend(matchedTodo,  validAttributes); 
	console.log("after: " + matchedTodo.completed); 
	res.json(matchedTodo); 

});


app.listen(PORT, function(){
	console.log('Express listening on port ' + PORT + '!');
});