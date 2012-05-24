var protoapp = require('../../');
var express = require('express');

// Define model

var model = 
{
    pages: [
        { name: 'hello', url: '/', content: '<h1>Hello, World</h1>' }
    ]
}

// Create application using model

var application = protoapp.createApplication(model);

express.createServer()
  .use(express.favicon())
  .use(express.logger())
  .use(express.router(function(app){
        // Register application in server routes
		application.register(app);
  })).listen(8000);
  
console.log('listening to http://localhost:8000');

