// BASE SETUP
// ======================================================

// call the packages the app needs
var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    Bear = require('./app/models/bear.js');

var app = express(); // defining my app using express

// configure app to using bodyParser()
// this will let me get the data from a POST
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/test');

var port = process.env.PORT || 8080; // set port


// ROUTES FOR API
// ======================================================
var router = express.Router(); // get an instance of express Router

// middleware to use for all requests
router.use(function(request, response, next) {
    console.log('Something is happening.');
    next(); // make sure tha app goes to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({
        message: 'hooray! welcome to our api!'
    });
});

router.route('/bears')
    .post(function(request, response) {
        var bear = new Bear();  // create a new instance of the Bear model
        bear.name = request.body.name;  // set the bears name (comes from the request)

        // save the bear and check for errors
        bear.save(function(err) {
            if(err)
                response.send(err);

            response.json({ message: 'Bear ' + bear.name + ' created'});
        });
    })
    .get(function(request, response) {
        Bear.find(function(err, bears) {
            if(err)
                response.send(err);

            response.json(bears);
        });
    });

router.route('/bears/:bear_id')
    .get(function(request, response) {
        Bear.findById(request.params.bear_id, function(err, bear) {
            if(err)
                response.send(err);

            response.json(bear);
        });
    })
    .put(function(request, response) {
        Bear.findById(request.params.bear_id, function(err, bear) {
            if(err)
                response.send(err);

            bear.name = request.body.name;

            bear.save(function(err) {
                if(err)
                    response.send(err);

                response.json({ message: 'Bear Update!'});
            });
        });
    })
    .delete(function(request, response) {
        Bear.remove({
            _id: request.params.bear_id
        }, function(err, bear) {
            if(err)
                response.send(err);

            response.json(bear);
        })
    });

// Register route
app.use('/api', router);


// STATER THE SERVER
// ======================================================
app.listen(port);
console.log('Magic happens on port ' + port);
