'use strict';
/*
Shehan Atuk
Full Stack Javascript Project 11
06/13/2019

**/
// load modules
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();

// set our port
app.set('port', process.env.PORT || 5000);

// morgan gives us http request logging
app.use(morgan('dev'));

// TODO add additional routes here
mongoose.connect("mongodb://localhost:27017/course-api", { useNewUrlParser: true});
const db = mongoose.connection;

//checks for connection errors and prints it if it does 
db.on("error", function(err){
  console.error("connection error:", err);
});

//working on seeding the database once connected to the database
db.once("open", function(){
  console.log("Mongodb connection successful");

});

//sends a greeting for the '/' route
app.get('/', (req, res) => {
  res.json({
      message: 'Welcome to the Course Review API'
  })
})
// send a friendly greeting for the root route
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//importing the routes file and using it
const routes = require('./routes');
app.use('/api', routes);


//use this route in order to test the global error handler
//tested and it works
app.get('/error', function (req, res) {
  throw new Error('Test error');
});

// send 404 if no routes were matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found'
  })
})

// This is the global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
