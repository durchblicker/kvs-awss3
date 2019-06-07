/*
** © 2013 by Philipp Dunkel <pip@pipobscure.com>. Licensed under MIT-License.
*/
/*jshint node:true, browser:false*/
'use strict';

module.exports = Amazon;
module.exports.kvt = 'store';

const AWS = require('aws-sdk');
const Abstract = require('kvs-abstract');

Abstract.bequeath(Amazon);
function Amazon (options) {
	Abstract.call(this);
	options = options || {};
	var awsOptions = {
		accessKeyId: options.key,
		secretAccessKey: options.secret,
		params: {
			Bucket: options.bucket
		},
		region: options.region
	};
	this.S3 = new AWS.S3(awsOptions);
	this.type = options.type || 'application/octet-stream';
}

Amazon.prototype._get = function (name, callback) {
	this.S3.getObject({Key: '/' + name}, function (err, data) {
		if (err) {
			if (err.statusCode >= 500) return callback(new Error('HTTP(' + res.statusCode + ')'));
			if (err.statusCode == 404) return callback(null, null);
			if (err.statusCode == 410) return callback(null, null);
			if (err.statusCode >= 300) return callback(new Error('HTTP(' + res.statusCode + ')'));
			callback(new Error(err));
		} else {
			callback(null, data.Body);
		}
	});
};

Amazon.prototype._set = function (name, value, callback) {
	value = Buffer.isBuffer(value) ? value : Buffer.from(String(value), 'utf-8');
	let params = {
		Body: value,
		Key: '/' + name,
		ContentLength: value.length,
		ContentType: this.type
	};
	this.S3.upload(params, function (err, data) {
		if (err) {
			if (err.statusCode >= 300) return callback(new Error('HTTP(' + err.statusCode + ')'), data.toString());
			callback(new Error(err));
		} else {
			callback(err, data);
		}
	});
};

Amazon.prototype._remove = function (name, callback) {
	this.S3.deleteObject({Key: '/' + name}, function (err, data) {
		if (err) {
			if (res.statusCode >= 300) return callback(new Error('HTTP(' + res.statusCode + ')'));
			callback(new Error(err));
		} else {
			callback();
		}
	});
};

Amazon.prototype._list = function (name, callback) {
	this.S3.listObjects({
		Prefix: '/' + name
	}, function (err, data) {
		if (err) return callback(err);
		if (!data || !data.Contents) return callback(new Error('no data'));
		callback(null, {
			count: data.Contents.length,
			values: data.Contents.map(function (item) { return item.Key; })
		});
	});
};
