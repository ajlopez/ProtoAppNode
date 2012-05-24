
var $ = require('../')
  , assert = require('assert')
  , fs = require('fs');

var model = $.loadModel(__dirname + '/simplemodel.json');

var cwd = fs.realpathSync(__dirname);

assert.ok(model);
assert.ok(model.__directory);
assert.ok(model.__filename);
assert.equal(model.__directory, cwd);
assert.equal(model.__filename, fs.realpathSync(__dirname + '/simplemodel.json'));
