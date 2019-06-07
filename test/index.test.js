/*
** © 2013 by Philipp Dunkel <pip@pipobscure.com>. Licensed under MIT-License.
*/
/*jshint node:true, browser:false*/
'use strict';

const expect = require('expect');
const Joi = require('@hapi/joi');
const Amazon = require('../');
const testEuWest1 = require('./test.json');
const testEuCentral1 = require('./test2.json');

[testEuWest1, testEuCentral1].forEach((item) => {
	const kvsA = new Amazon(item);
	const testData = Buffer.from('test');

	test('set a value', done => {
		kvsA.set('test', testData, function (err) {
			expect(!err).toBe(true);
			done();
		});
	});
	test('get a value', done => {
		kvsA.get('test', function (err, val) {
			expect(!err).toBe(true);
			expect(typeof val).toBe('object');
			expect(val.toString()).toBe(testData.toString());
			done();
		});
	});
	test('get a non existant value', done => {
		kvsA.get('test1234', function (err, val) {
			expect(err).toBe(null);
			expect(val).toBe(null);
			done();
		});
	});
	test('list a value', done => {
		kvsA.list('test', function (err, val) {
			const schema = Joi.object().keys({
				count: Joi.number().integer().min(1),
				values: Joi.array().items(Joi.string())
			});
			const result = Joi.validate(val, schema);
			expect(!err).toBe(true);
			expect(!result.error).toBe(true);
			done();
		});
	});
	test('remove a value', done => {
		kvsA.remove('test', function (err) {
			expect(!err).toBe(true);
			done();
		});
	});
});
