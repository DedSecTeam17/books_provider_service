var express = require('express');
var router = express.Router();


const restify_jwt = require('restify-jwt-community');
require('dotenv').config()


const ReviewController = require('../controllers/review');

//user_id


router.get('/users/:user_id/books/:book_id/reviews', ReviewController.index);
router.get('/users/:user_id/books/:book_id/reviews/:review_id', ReviewController.show);
router.post('/users/:user_id/books/:book_id/reviews', ReviewController.create);
router.put('/users/:user_id/books/:book_id/reviews/:review_id', ReviewController.update);
router.delete('/users/:user_id/books/:book_id/reviews/:review_id', ReviewController.delete);





//reviews 



module.exports = router;
