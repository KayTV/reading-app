var express = require('express');
var router = express.Router();
var knex = require('../../../db/knex');
function authors() {
  return knex('author');
}
function books() {
  return knex('books');
}

function both() {
  return knex('books')
  .join('author', 'author.id', 'author_one');
}


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Galvanize Reads' });
});

router.get('/addbook', function(req, res, next) {
  res.render('addbook', { title: 'Galvanize Reads: Add Book' });
});

router.get('/books', function(req, res, next) {
  both().select()
  .then(function(books){
    res.render('books', { books: books , title: 'Galvanize Reads: Books' });
  })
});

router.get('/authors', function(req, res, next) {
  authors().select()
  .then(function(authors){
    res.render('authors', { authors: authors, title: 'Galvanize Reads: Authors' });
  })
});

router.get('/showpage/:id', function(req, res, next) {
  books().where('id', req.params.id).first()
  .then(function(book){
    res.render('showpage', {user: req.user, book: book});
  });
})

router.get('/showpageauthor/:id', function(req, res, next) {
  authors().where('id', req.params.id).first().then(function(author){
    res.render('showpageauthor', {user: req.user, author: author});
  });
})

router.get('/editbook/:id', function(req, res, next) {
  books().where('id', req.params.id)
    .then(function (book) {
      res.status(200)
        res.render('editbook',{
          book: book[0],
          user: req.user,
        });
    })
    .catch(function (err) {
      return next(err);
    });
});

router.get('/editauthor/:id', function(req, res, next) {
  authors().where('id', req.params.id)
    .then(function (author) {
      res.status(200)
        res.render('editauthor',{
          author: author[0],
          user: req.user,
        });
    })
    .catch(function (err) {
      return next(err);
    });
});

module.exports = router;
