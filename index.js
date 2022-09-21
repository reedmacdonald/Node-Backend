const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
  });

const db = require('./queries')

const portNumber = 3001
const server = app.listen(process.env.PORT || portNumber, function () {
    let host = server.address().address
    let port = server.address().port
})

app.get('/users', db.getUsers)
app.get('/bayern', db.getBayernScore)
app.get('/users/:id', db.getUserById)
app.post('/users',db.createUser)
app.put('/users/:id',db.updateUser)
app.delete('/users/:id',db.deleteUser)