var router = require('express').Router();
var mongoose = require('mongoose');
var Books = mongoose.model('Books');

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
            Books.find(query)
                .limit(Number(limit))
                .skip(Number(offset))
                .sort({ createdAt: 'desc' })
                .populate('author')
                .exec(),
            Books.count(query).exec()
        ]).then(function (results) {
            var books = results[0];
            var booksCount = results[1];

            return res.json({
                books: books.map(function (book) {
                    return book.toJSONFor();
                }),
                booksCount: booksCount
            });
        });
    }).catch(next);
});

router.get('/:book', function (req, res, next) {
    Promise.all([
        req.book.populate('author').execPopulate()
    ]).then(function (results) {
        return res.json({ book: req.book.toJSONFor() });
    }).catch(next);
});

router.post('/', function (req, res, next) {
    var book = new Books(req.body.book);

    return book.save().then(function () {
        return res.json({ book: book.toJSONFor() });
    });
});

router.put('/', function (req, res, next) {
    if (typeof req.body.book.title !== 'undefined') {
        req.book.title = req.body.book.title;
    }

    if (typeof req.body.book.price !== 'undefined') {
        req.book.price = req.body.book.price;
    }

    if (typeof req.body.book.isbn !== 'undefined') {
        req.book.isbn = req.body.book.isbn;
    }

    if (typeof req.body.book.language !== 'undefined') {
        req.book.language = req.body.book.language
    }

    if (typeof req.body.book.numberOfPages !== 'undefined') {
        req.book.numberOfPages = req.body.book.numberOfPages
    }

    if (typeof req.body.book.publisher !== 'undefined') {
        req.book.publisher = req.body.book.publisher
    }

    if (typeof req.body.book.author !== 'undefined') {
        req.book.author = req.body.book.author
    }

    req.book.save().then(function (book) {
        return res.json({ book: book.toJSONFor() });
    }).catch(next);
});

router.delete('/:book', function (req, res, next) {
    return req.book.remove().then(function () {
        return res.sendStatus(204);
    });
});

module.exports = router;