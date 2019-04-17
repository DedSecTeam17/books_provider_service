var express = require('express');
var router = express.Router();


const restify_jwt = require('restify-jwt-community');
require('dotenv').config()


const ChatController = require('../controllers/chat');


router.get('/chats/provider/:provider_id/customer/:customer_id',restify_jwt({secret: 'secret'}),  ChatController.index);
router.get('/chats/:chat_id',restify_jwt({secret: 'secret'}),  ChatController.show);
// moved to customer service
router.post('/chats', restify_jwt({secret: 'secret'}), ChatController.create);
router.put('/chats/:chat_id', restify_jwt({secret: 'secret'}), ChatController.update);
router.delete('/chats/:chat_id', restify_jwt({secret: 'secret'}), ChatController.delete);



module.exports = router;
