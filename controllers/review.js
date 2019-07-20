const errors = require('restify-errors');
const User = require('../models/User');
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
        const user = await User.findById({_id: req.params.user_id});
        const reviews = await user.books.id(req.params.book_id).reviews;
        sendJsonResponse(res, reviews, 200);
    } catch (e) {
        sendJsonResponse(res, e, 200);

    }


}


module.exports.show = async (req, res, next) => {
    try {
        const user = await User.findById({_id: req.params.user_id});
        const review = await user.books.id(req.params.book_id).reviews.id(req.params.review_id);
        sendJsonResponse(res, review, 200);

    } catch (e) {
        sendJsonResponse(res, e, 200);

    }
}


module.exports.create = async (req, res, next) => {

    try {
        const user = await User.findById({_id: req.params.user_id});
        const reviews = await user.books.id(req.params.book_id).reviews;

        const {customer_id, rating, review} = req.body;

        reviews.push({
            customer_id: customer_id,
            rating: rating,
            review: review,
            replays: []
        });
        const saved_user = await user.save();

        sendJsonResponse(res, saved_user.books.id(req.params.book_id).reviews, 200);

    } catch (e) {
        sendJsonResponse(res, e.message, 200);

    }


}


module.exports.update = async (req, res, next) => {
    try {
        const user = await User.findById({_id: req.params.user_id});
        const review = await user.books.id(req.params.book_id).reviews.id(req.params.review_id);
        review.set(req.body);
        const update_review = await user.save();
        sendJsonResponse(res, update_review, 200);

    } catch (e) {
        sendJsonResponse(res, e.message, 200);

    }
}


module.exports.delete = async (req, res, next) => {
    try {
        const user = await User.findById({_id: req.params.user_id});
        const review = await user.books.id(req.params.book_id).reviews.id(req.params.review_id);
        review.remove();
        await user.save();

        sendJsonResponse(res, null, 200);

    } catch (e) {
        sendJsonResponse(res, e, 200);

    }
}


async function deleteFile(path) {
    try {
        await fs.remove(path)
        console.log('success!')
    } catch (err) {
        console.error(err)
    }
}


function sendJsonResponse(res, data, status) {
    res.status(status);
    res.send(data);
}
