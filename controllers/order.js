const errors = require('restify-errors');
const Order = require('../models/Order');
const bcrypt = require('bcryptjs');
const restify_jwt = require('restify-jwt-community');
require('dotenv').config()
const jwt = require('jsonwebtoken');
const {authentication} = require('../auth');
const path = require('path');
const multer = require('multer');

var hbs = require('nodemailer-express-handlebars');
var nodemailer = require('nodemailer');
var randtoken = require('rand-token');

const fs = require('fs-extra')


const storage = multer.diskStorage(
    {
        destination: './public/uploads/books_images',
        filename: function (req, file, cb) {
            const file_name = "app_books_provider" + '_' + Date.now() + path.extname(file.originalname);
            console.log("shit")
            cb(null, file_name);
        }
    }
);
const upload = multer({
    storage: storage,
    limits: {fileSize: (1024 * 1024) * 200},
    fileFilter: function (req, file, cp) {
        checkForType(cp, file);
    }
}).single('book_image');

function checkForType(cp, file) {
    console.log("CHECK ")
    const type = /jpeg|png|jpg|gif|/;
    const extname = type.test(path.extname(file.originalname).toLowerCase());
    const mimeType = type.test(file.mimetype);

    if (extname && mimeType) {
        cp(null, true);
    } else {
        cp('Error invalid image', false);
    }
}


module.exports.index = async (req, res, next) => {

    try {
        const oreders = await Order.find({provider_id: req.params.provider_id});

        sendJsonResponse(res, oreders, 200);
    } catch (e) {
        sendJsonResponse(res, e, 200);

    }
}
module.exports.show = async (req, res, next) => {
    try {
        const order = await Order.findById({_id: req.params.order_id});
        sendJsonResponse(res, order, 200);
    } catch (e) {
        sendJsonResponse(res, e, 200);

    }
}



///orders/provider/:provider_id/customer/:customer_id/book/:book_id
// provider_id: {type: mongoose.SchemaTypes.ObjectId, required: true},
//     book_id: {type: mongoose.SchemaTypes.ObjectId, required: true},
//     customer_id: {type: mongoose.SchemaTypes.ObjectId, required: true},
//     quantity: {type: String, required: true},
//     user_location: {
//         lat:{type: String, required: true},
//         long:{type: String, required: true}
//     },
//     State: {type: String, required: true},
//     total_price: {type: String, required: true}
module.exports.create = async (req, res, next) => {

    const  {
        State,
        total_price,
        lat,
        long,
        quantity,
    }=req.body;

    try {
        const order =  Order(
            {
                provider_id : req.params.provider_id,
                book_id : req.params.book_id,
                customer_id : req.params.customer_id,
                State : State,
                total_price : total_price,
                user_location : {
                    lat : lat,
                    long : long
                },
                quantity :quantity



            }
        );

        const saved_order = await order.save();

        sendJsonResponse(res, saved_order, 200);

    } catch (e) {
        sendJsonResponse(res, e.message, 200);

    }


}


module.exports.update = async (req, res, next) => {
    try {
        const order = await Order.findOneAndUpdate({_id:req.params.order_id},{State : req.body.State});

        sendJsonResponse(res, order, 200);
    } catch (e) {
        sendJsonResponse(res, e.message, 200);

    }
}


module.exports.delete = async (req, res, next) => {
    try {
        const order = await Order.findOneAndRemove({_id: req.params.order_id});

        sendJsonResponse(res, null, 200);

    } catch (e) {
        sendJsonResponse(res, e, 200);

    }
}



function sendJsonResponse(res, data, status) {
    res.status(status);
    res.send(data);
}


/*
*
*
*
*
* ALERT THIS PART MOVED TO CUSTOMERS SERVICES
* AND EACH CUSTOMER HAVE MANY ORDER SO SUBDOCSMENTS
* ONLY THE CREATION OF ORDER
*
*
*
*
* */