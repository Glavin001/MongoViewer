// Dependencies
var express = require('express');
var mongodb = require('mongodb');
var nconf = require('nconf');

// Configuration
nconf.argv()
       .env()
       .file({ file: './default_config.json' });

// Create your server
var app = express();

// Connect to MongoDB
var MongoClient = mongodb.MongoClient;

MongoClient.connect("mongodb://localhost:"+nconf.get('mongo:port')+"/"+nconf.get('mongo:database'), function(err, db) {

    if (err) {
        console.error(err);
        process.exit();
        return;
    }

    // Config Express server
    app.use(express.logger());

    // Add static files
    app.use(express.static(__dirname+'/public'));
    app.use(express.static(__dirname+'/bower_components'));

    // Create REST API
    var queryToJson = function(query) {
        var j = {};
        for (var k in query) {
            console.log(k, query[k]);
            var v = null;
            try {
                v = JSON.parse(query[k]);
            } catch (err) {
                console.error(err);
                v = query[k];
            }
            j[k] = v;
        }
        return j;
    };

    var basic = function(callback) {
        return function(req, res) {
            var query = queryToJson(req.query);
            db.collection(req.params.collection, function(err, collection) {
                if (err) {
                    return res.json({'error': err.toString() });
                }
                else {
                    var respCallback = function(json) {
                        return res.json(json);
                    };
                    return callback && callback(collection, query, respCallback);
                }
            });
        }
    };

    // Find Queries
    var find = basic(function(collection, query, callback) {
        var q = query.query || {};
        var fields = query.fields || {};
        var options = query.options || {};
        collection.find(q, fields, options).toArray(function(err, docs) {
            return callback(docs);
        });
    });
    app.get('/api/v1/:collection/find', find);

    // FindOne Queries
    var findOne = basic(function(collection, query, callback) {
        var q = query.query || {};
        var fields = query.fields || {};
        var options = query.options || {};
        collection.findOne(q, fields, options, function(err, doc) {
            return callback(doc);
        });
    });
    app.get('/api/v1/:collection/findOne', findOne);

    // Aggregation Queries
    var aggregation = basic(function(collection, query, callback) {
        var pipeline = query.pipeline || [];
        var options = query.options || {};
        collection.aggregate(pipeline, options, function(err, docs) {
            return callback(docs);
        });
    });
    app.get('/api/v1/:collection/aggregate', aggregation);


    // Start server
    app.listen(nconf.get('server:port'), function() {
        console.info('Server listening on port '+nconf.get('server:port')+'.');
    });

});