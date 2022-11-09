var router = require('express').Router();
var mongoose = require('mongoose');
var Authors = mongoose.model('Authors');

router.get('/', function (req, res, next) {
    var query = {};
    var limit = 20;
    var offset = 0;

    if (typeof req.query.limit !== 'undefined') {
        limit = req.query.limit;
    }

    if (typeof req.query.offset !== 'undefined') {
        offset = req.query.offset;
    }

    Promise.all([
    ]).then(function (results) {
        return Promise.all([
            Authors.find(query)
                .limit(Number(limit))
                .skip(Number(offset))
                .sort({ createdAt: 'desc' })
                .exec(),
                Authors.count(query).exec()
        ]).then(function (results) {
            var authors = results[0];
            var authorsCount = results[1];

            return res.json({
                authors: authors.map(function (author) {
                    return author.toJSONFor();
                }),
                authorsCount: authorsCount
            });
        });
    }).catch(next);
});

router.get('/:author', function (req, res, next) {
    Promise.all([
    ]).then(function (results) {
        return res.json({ author: req.author.toJSONFor() });
    }).catch(next);
});

router.post('/', function (req, res, next) {
    var author = new Authors(req.body.author);

    return author.save().then(function () {
        return res.json({ author: author.toJSONFor() });
    });
});

router.put('/', function (req, res, next) {
    if (typeof req.body.author.name !== 'undefined') {
        req.author.name = req.body.author.name;
    }
    
    if (typeof req.body.author.country !== 'undefined') {
        req.author.country = req.body.author.country;
    }
    
    if (typeof req.body.author.birthDate !== 'undefined') {
        req.author.birthDate = req.body.author.birthDate;
    }

    req.author.save().then(function (author) {
        return res.json({ author: author.toJSONFor() });
    }).catch(next);
});

router.delete('/:book', function (req, res, next) {
    return req.author.remove().then(function () {
        return res.sendStatus(204);
    });
});



module.exports = router;