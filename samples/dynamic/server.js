var protoapp = require('../../');
var fs = require('fs');
var express = require('express');

// Load model

var model = JSON.parse(fs.readFileSync('./model.json').toString());

// Quick hack for require dynamic content from this directory

model.directory = __dirname;

// Create application using model

var application = protoapp.createApplication(model);

express.createServer()
  .use(express.favicon())
  .use(express.logger())
  .use('/content', express.static(__dirname + '/content'))
  .use(express.router(function(app){
        // Register application in server routes
		application.register(app);
  })).listen(8000);
  
console.log('listening to http://localhost:8000');

