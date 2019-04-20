var express = require('express');
var router = express.Router();


const restify_jwt = require('restify-jwt-community');
require('dotenv').config()


const ReplayController = require('../controllers/replay');

//user_id


router.get('/users/:user_id/books/:book_id/reviews/:review_id/replays', ReplayController.index);
router.get('/users/:user_id/books/:book_id/reviews/:review_id/replays/:replay_id', ReplayController.show);
router.post('/users/:user_id/books/:book_id/reviews/:review_id/replays', ReplayController.create);
router.put('/users/:user_id/books/:book_id/reviews/:review_id/replays/:replay_id', ReplayController.update);
router.delete('/users/:user_id/books/:book_id/reviews/:review_id/replays/:replay_id', ReplayController.delete);





//reviews 



module.exports = router;
