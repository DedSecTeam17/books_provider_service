var express = require('express');
var router = express.Router();


const restify_jwt = require('restify-jwt-community');
require('dotenv').config()


const OrderController = require('../controllers/order');

//user_id


// order by provider id

// order create by customer id


// only provider can update and delete the order
//update the oder state
// delete when reject
//


// get order by provider id
router.get('/orders/provider/:provider_id',  OrderController.index);

router.get('/orders/:order_id',  OrderController.show);

// moved to customer service
router.post('/orders/provider/:provider_id/customer/:customer_id/book/:book_id', OrderController.create);

router.put('/orders/:order_id', restify_jwt({secret: 'secret'}), OrderController.update);

router.delete('/orders/:order_id', restify_jwt({secret: 'secret'}), OrderController.delete);


//add order line ----------->
router.get('/orders/:order_id/order_line',  OrderController.allOrderLine);
router.get('/orders/:order_id/order_line/:order_line_id',  OrderController.showOrderLine);
router.post('/orders/:order_id/order_line',  OrderController.createOrderLine);
router.delete('/orders/:order_id/order_line/:order_line_id',  OrderController.deleteOrderLine);



module.exports = router;
