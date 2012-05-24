
var $ = require('../')
  , assert = require('assert');
  
var model = { 
	pages: [
		{ name: 'home', url: '/' },
		{ name: 'help', url: '/help' }
	]
};

function PageProcessor(model, page)
{
	this.process = function(req, res)
	{
		res.write(page.name);
	}
}

function Response()
{
	this.output = '';
	this.write = function(text) { this.output += text; };
}
  
var application = $.createApplication(model)
	.use('page', { create: function(model, page) { return new PageProcessor(model, page); } });

assert.ok(application);

var app = { pages: { } };

app.get = function(url, fn)
{
	this.pages[url] = fn;
}
 
application.register(app);

assert.ok(app.pages['/']);
assert.equal(typeof app.pages['/'].process, 'function');
assert.ok(app.pages['/help']);
assert.equal(typeof app.pages['/help'].process, 'function');

var req = {};
var res = new Response();

app.pages['/'].process(req, res);
assert.equal(res.output, 'home');

res = new Response();

app.pages['/help'].process(req, res);
assert.equal(res.output, 'help');
