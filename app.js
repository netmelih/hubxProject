var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));


// if (!isProduction) {
//     app.use(errorhandler());
// }

mongoose.connect("mongodb://localhost:27018");

require('./models/Books');
require('./models/Authors');

app.use(require('./routes'));

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({
        'errors': {
            message: err.message,
            error: err
        }
    });
});

var server = app.listen(9700, function () {
    console.log('Listening on port ' + server.address().port);
});