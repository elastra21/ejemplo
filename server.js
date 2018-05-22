//Server.js

//set up ==========================================================================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var path = require('path');
var configDB = require('./config/database.js');
var ipaddress = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;

//configuración ==========================================================================================
mongoose.connect(configDB.db(),{useMongoClient: true });
app.use(express.static(__dirname + '/client'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

//acciones ==========================================================================================
var Todo = mongoose.model('Todo', {
    text : String
});

app.get('/api/todos', function(req, res) {
    Todo.find(function(err, todos) {
        if (err)
            res.send(err)
        res.json(todos); 
    });
});


app.post('/api/todos', function(req, res) {
    Todo.create({
        text : req.body.text,
        done : false
    }, function(err, todo) {
        if (err)
            res.send(err);
        Todo.find(function(err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });
});

app.delete('/api/todos/:todo_id', function(req, res) {
    Todo.remove({
        _id : req.params.todo_id
    }, function(err, todo) {
        if (err)
            res.send(err);
        Todo.find(function(err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });
});

app.get('*', function(req, res){
	res.sendFile(path.join(__dirname, 'client/index.html'));
});

app.listen(port, ipaddress, function() {
    console.log('The magic happens on ' +ipaddress+':'+ port);
});
