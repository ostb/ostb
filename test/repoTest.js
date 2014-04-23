var mocha    = require('mocha');
var should   = require('should');
var Promise  = require('bluebird');
var port     = 3000;

describe('entered test', function() {
  it('should run this test', function(done) {
    var bool = true;
    bool.should.equal(true);
  });
});