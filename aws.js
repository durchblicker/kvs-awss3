/*
** © 2013 by Philipp Dunkel <pip@pipobscure.com>. Licensed under MIT-License.
*/
/*jshint node:true, browser:false*/
'use strict';

module.exports = Amazon;

var knox = require('knox');
var Abstract = require('kvs-abstract');

Abstract.bequeath(Amazon);
function Amazon(options) {
  Abstract.call(this);
  this.client = knox.createClient(options);
  this.type = options.type || 'application/octet-stream';
}

Amazon.prototype._get = function(name, callback) {
  this.client.get('/'+name).on('response', function(res) {
    if (res.statusCode >= 500) return callback(new Error('HTTP('+res.statusCode+')'));
    if (res.statusCode == 404) return callback(null, null);
    if (res.statusCode == 410) return callback(null, null);
    if (res.statusCode >= 300) return callback(new Error('HTTP('+res.statusCode+')'));
    slurp(res, callback);
  }).end();
};

Amazon.prototype._set = function(name, value, callback) {
  value = Buffer.isBuffer(value) ? value : new Buffer(String(value), 'utf-8');
  this.client.put('/'+name, { 'Content-Length':value.length, 'Content-Type':this.type }).on('response', function(res) {
    slurp(res, function(err, val) {
      if (res.statusCode >= 300) return callback(new Error('HTTP('+res.statusCode+')'), val.toString());
      callback(null, res.statusCode);
    });
  }).end(value);
};

Amazon.prototype._remove = function(name, callback) {
  this.client.del('/'+name).on('response', function(res) {
    if (res.statusCode >= 300) return callback(new Error('HTTP('+res.statusCode+')'));
    callback(null, res.statusCode);
  }).end();
};

Amazon.prototype._list = function(name, callback) {
  this.client.list({ prefix:name }, function(err, data) {
    if (err) return callback(err);
    if (!data || !data.Contents) return callback(new Error('no data'));
    callback(null, {
      count:data.Contents.length,
      values:data.Contents.map(function(item) { return item.Key; })
    });
  });
};

function slurp(res, cb) {
  var dat=[], len=0;
  res.on('data', function(chunk) {
    dat.push(chunk);
    len+=chunk.length;
  });
  res.on('end', function() {
    cb(null, Buffer.concat(dat, len));
  });
  res.on('error', cb);
}
