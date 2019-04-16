var express = require('express');
var router = express.Router();


const restify_jwt = require('restify-jwt-community');
require('dotenv').config()


const BooksController = require('../controllers/book');

//user_id


router.get('/users/:user_id/books',  BooksController.index);

router.get('/users/:user_id/books/:book_id', BooksController.show);

router.post('/users/:user_id/books', restify_jwt({secret: 'secret'}), BooksController.create);

router.post('/users/:user_id/books/:book_id', restify_jwt({secret: 'secret'}), BooksController.uploadBookImage);



router.put('/users/:user_id/books/:book_id', restify_jwt({secret: 'secret'}), BooksController.update);

router.delete('/users/:user_id/books/:book_id', restify_jwt({secret: 'secret'}), BooksController.delete);



router.get('/users/books/:book_name', BooksController.getBookImage);



module.exports = router;
