#! /usr/bin/env node

// Dependencies
var nconf = require('nconf');
var mongodb = require('mongodb');

// Configuration 
nconf.argv()
       .env()
       .file({ file: './default_config.json' });

// Connect to MongoDB
var MongoClient = mongodb.MongoClient;

MongoClient.connect("mongodb://localhost:"+nconf.get('mongo:port')+"/"+nconf.get('mongo:database'), function(err, db) {

    if (err) {
        console.error(err);
        process.exit();
        return;
    }

    // Discrete Bar data set 
    console.log('Loading Discrete Bar data');
    var discreteBar = require('./example_data/discreteBar.json');
    db.collection('discreteBar', function(err, collection) {
        collection.insert(discreteBar, function(err, result) {
            if (err) {
                console.error(err);
            }
            else {
                console.log(result);
            }

            // Exit
            db.close();
            
        });
    });
});
