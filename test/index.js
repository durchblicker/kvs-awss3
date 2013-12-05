/*
** © 2013 by Philipp Dunkel <pip@pipobscure.com>. Licensed under MIT-License.
*/
/*jshint node:true, browser:false*/
'use strict';

var Lab = require('lab');
var Joi = require('joi');
var Amazon = require('../');

var kvsA = new Amazon(require('./test.json'));
var testData = new Buffer('test');

Lab.test('set a value', function(done) {
  kvsA.set('test', testData, function(err) {
    Lab.expect(!err).to.equal(true);
    done();
  });
});
Lab.test('get a value', function(done) {
  kvsA.get('test', function(err, val) {
    Lab.expect(!err).to.equal(true);
    Lab.expect(val).to.be.an('object');
    Lab.expect(val.toString()).to.equal(testData.toString());
    done();
  });
});
Lab.test('list a value', function(done) {
  kvsA.list('test', function(err, val) {
    Lab.expect(!err).to.equal(true);
    Lab.expect(!Joi.validate(val, {
      count:Joi.number().integer().min(1),
      values:Joi.array().includes(Joi.string())
    })).to.equal(true);
    done();
  });
});
Lab.test('remove a value', function(done) {
  kvsA.remove('test', function(err) {
    Lab.expect(!err).to.equal(true);
    done();
  });
});
