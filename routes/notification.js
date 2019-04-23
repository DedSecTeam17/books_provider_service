var express = require('express');
var router = express.Router();


const restify_jwt = require('restify-jwt-community');
require('dotenv').config()


const NotificationController = require('../controllers/notification');

//user_id


// order by provider id

// order create by customer id


// only provider can update and delete the order
//update the oder state
// delete when reject
//


// get order by provider id
router.get('/notifications/:provider_id',restify_jwt({secret: 'secret'}),  NotificationController.index);

router.get('/notifications/show/:notification_id',restify_jwt({secret: 'secret'}),  NotificationController.show);

// moved to customer service
router.post('/notifications',  NotificationController.create);
router.put('/notifications/:notification_id', NotificationController.update);
router.delete('/notifications/:notification_id', restify_jwt({secret: 'secret'}), NotificationController.delete);



module.exports = router;
