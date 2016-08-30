var express = require('express');
var bodyParser = require('body-parser');
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
	var matchedTodo; 
	//iterate over todos array and find a match
	todos.forEach(function(todo) {
		console.log(todo.id);
		console.log(todoId);
		if (todo.id === todoId) 
		{
			matchedTodo = todo; 
			console.log('found a match for id:' + todoId);
		}
	});

    if (matchedTodo) {
    	res.json(matchedTodo);
    	return; 
    } else {
		// send a 404, since we didn't return. 
		res.status(404).send(); 
    }
});

// POST /todos
app.post('/todos', function(req, res) {
	var body = req.body;
	
	// add id field
	body.id = todoNextId++;

	console.log('got here');
	// push body to array
	todos.push(body);
	console.log(body.description); 
	res.json(body);
});

app.listen(PORT, function(){
	console.log('Express listening on port ' + PORT + '!');
});