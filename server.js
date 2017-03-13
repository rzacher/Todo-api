var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore'); 
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;

var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

// Get /
app.get('/', function(req, res) {
 
	res.send('Todo API root'); 
});


// GET /todos?completed = true&q=house
app.get('/todos', function (req, res) {
	var query = req.query; 
	var where = {};

	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false; 
	}

    if (query.hasOwnProperty('q') && query.q.length > 0) {
    	where.description = {
          $like: '%' + query.q + '%'
        };
    }

	db.todo.findAll({where: where}).then(function (todos) {
           res.json(todos);
       }, function (e) {
         res.status(500).send(); 
     });

	// filteredTodos = todos;

	// if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
	// 	filteredTodos = _.where(filteredTodos, {completed: true});
	// }
	// else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
	// 	filteredTodos = _.where(filteredTodos, {completed: false});
	// }
	
 //    // .indexOf(q) > -1
 //    if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
 //    	filteredTodos = _.filter(filteredTodos, function (todo) {
 //    		return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1; 
 //        }); 
 //    }

	//res.json(filteredTodos);
});
// GET /todos/:id
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);

	 db.todo.findById(todoId).then(function (todo) {
	 	 if (!!todo) {
           res.json(todo.toJSON());
         } else {
         	res.status(404).send(); 
         }
       }, function (e) {
         res.status(500).json(e).send();
         console.log(e); 
     });

});

// POST /todos
app.post('/todos', function(req, res) {
	console.log('start todos');
	// use _.pick to only pick description and completed. 
	var body = _.pick(req.body, 'description', 'completed');
	console.log("in app.post");
	console.log(body); 	

    db.todo.create(body).then(function (todo) {
               res.json(todo.toJSON());
            }, function (e) {
              res.status(400).json(e);
              console.log(e); 
            });
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

db.sequelize.sync().then(function() {
	app.listen(PORT, function(){
		console.log('Express listening on port ' + PORT + '!');
	});
});

