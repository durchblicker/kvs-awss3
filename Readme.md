# KVS - AWS S3
[KVS](http://npmjs.org/package/kvs) or   *K*ey *V*alue *S*tore is an abstract KeyValueStore system. The *kvs-** group of node modules, are intended to present a unified interface to key value stores of every persuasion. This allows for substituting them without changing anything but the initializing parameters.

*KVS-awss3* is a KVS compliant module that uses [Amazon Web Services S3](http://aws.amazon.com) as a persitance layer.  It uses [knox](http://npmjs.org/package/knox) to interact with S3.
## Install
    npm install kvs-awss3
## Testing
in order to test via `npm test` you have to put the initialization object into *test/test.json*.

## Use
    var KVS=require('kvs-awss3');
    var store = new KVS({ 
    	key:'', // your AWS Key
    	secret:'', // your AWS Secret
    	bucket:'', // your AWS S3 bucket
    	… // basically any parameter that knox understands.
    }); 
    store.set('name', new Buffer('value is a buffer'), function(err) {…});
    store.get('name', function(err, value) { … });
    store.remove('name', function(err) { … });
    store.list('name', function(err, value) { … });

## License (MIT)
**Copyright (c) 2013 [Philipp Dunkel](mailto:pip@pipobscure.com)**

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

