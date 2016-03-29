var express = require('express');
var router = express.Router();
var knex = require('../../../db/knex');
var passport = require('../lib/auth');
var helpers = require('../lib/helpers');
function authors() {
  return knex('author');
}
function books() {
  return knex('books');
}

function both2() {
  return knex('author')
  .join('books', 'author.id', 'books.id');
}


router.get('/', function(req, res, next) {
  res.render('index', { user: req.user, title: 'Galvanize Reads' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { user: req.user, title: 'Marketing' });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user) {
    if (err) {
      res.render('login', {title: 'Error', errors: ['Email and/or password incorrect']})
      // return next(err);
    } else {
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
    }
  })(req, res, next);
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { user: req.user, title: 'Marketing' });
});

router.post('/signup', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var name = req.body.name;
  knex('users').where('email', email)
    .then(function(data){
      // if email is in the database send an error
      if(data.length) {
        res.render('signup', {title: 'Error', errors: ['Email already exists']})
      } else {
        // hash and salt the password
        var hashedPassword = helpers.hashing(password);
        // if email is not in the database insert it
        knex('users').insert({
          email: email,
          name: name,
          password: hashedPassword
        })
        .then(function(data) {
          req.flash('message', {
            status: 'success',
            message: 'welcome'
          });
          return res.redirect('/login');
        })
        .catch(function(err) {
          return res.send('crap');
        });
      }
    })
    .catch(function(err){
      return next(err);
    });
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

router.get('/addbook', function(req, res, next) {
  res.render('addbook', { user: req.user, title: 'Galvanize Reads: Add Book' });
});

router.post('/addbook', function(req, res, next) {
  authors().insert({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    image_url: req.body.image_url,
    biography: req.body.biography
  }, 'id').then(function(id){
    books().insert({
      title: req.body.title,
      genre: req.body.genre,
      cover_url: req.body.cover_url,
      description: req.body.description,
      author_one: +id
    }, 'id').then(function(result){
      res.redirect('/')
    })
  })
});

router.get('/books', function(req, res, next) {
  both2().select()
  .then(function(books){
    res.render('books', { user: req.user, books: books , title: 'Galvanize Reads: Books' });
  })
});

router.get('/authors', function(req, res, next) {
  authors().select()
  .then(function(authors){
    res.render('authors', { user: req.user, authors: authors, title: 'Galvanize Reads: Authors' });
  })
});

router.get('/showpage/:id', function(req, res, next) {
  both2().where('author.id', req.params.id).first()
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

router.post('/editbook/:id', function(req, res, next) {
  books().where('id', req.params.id).update(req.body)
  .then(function() {
    res.status(200);
    res.redirect('/showpage/'+req.params.id);
  })
  .catch(function (error) {
    return next(err);
  })
})

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

router.post('/editauthor/:id', function(req, res, next) {
  authors().where('id', req.params.id).update(req.body)
  .then(function() {
    res.status(200);
    res.redirect('/showpageauthor/'+req.params.id);
  })
  .catch(function (error) {
    return next(err);
  })
})

router.post('/showpage/:id', function(req, res, next){
  console.log('delete');
  both2().where('id', req.params.id).del().then(function(result){
    res.redirect('/books')
  });
});

router.post('/showpageauthor/:id', function(req, res, next){
  console.log('delete');
  authors().where('id', req.params.id).del().then(function(result){
    res.redirect('/author')
  });
});

module.exports = router;
