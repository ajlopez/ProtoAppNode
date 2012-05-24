
var $ = require('../')
  , assert = require('assert');
  
var params = { id: 1, name: 'foo' };

assert.equal($.expandLink("/link", params), "/link");
assert.equal($.expandLink("/link/:id", params), "/link/1");
assert.equal($.expandLink("/link/:name/:id", params), "/link/foo/1");
assert.equal($.expandLink("/link/show?id=:id", params), "/link/show?id=1");
assert.equal($.expandLink("/link/:param", params), "/link/:param");
