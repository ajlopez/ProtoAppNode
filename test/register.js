
var $ = require('../')
  , assert = require('assert');
  
var model = { 
	pages: [
		{ name: 'home', url: '/' },
		{ name: 'help', url: '/help' }
	]
};
  
var application = $.createApplication(model);

assert.ok(application);

var app = { pages: { } };

app.get = function(url, fn)
{
	this.pages[url] = fn;
}
 
application.register(app);

assert.ok(app.pages['/']);
assert.equal(typeof app.pages['/'], 'function');
assert.ok(app.pages['/help']);
assert.equal(typeof app.pages['/help'], 'function');

