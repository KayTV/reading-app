var express = require('express');
var router = express.Router();
var knex = require('../../../db/knex');
function authors() {
  return knex('author');
}
function books() {
  return knex('books');
}



router.get('/', function(req, res, next) {
  res.render('index', { title: 'Galvanize Reads' });
});

router.get('/books', function(req, res, next) {
  res.render('books', { title: 'Galvanize Reads: Books' });
});

router.get('/authors', function(req, res, next) {
  res.render('authors', { title: 'Galvanize Reads: Authors' });
});

module.exports = router;
