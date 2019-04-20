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
        const replays = await user.books.id(req.params.book_id).reviews.id(req.params.review_id).replays;
        sendJsonResponse(res, replays, 200);
    } catch (e) {
        sendJsonResponse(res, e, 200);

    }


}


module.exports.show = async (req, res, next) => {
    try {
        const user = await User.findById({_id: req.params.user_id});
        const replay = await user.books.id(req.params.book_id).reviews.id(req.params.review_id).replays.id(req.params.replay_id);
        sendJsonResponse(res, replay, 200);

    } catch (e) {
        sendJsonResponse(res, e, 200);

    }
}


module.exports.create = async (req, res, next) => {

    try {
        const user = await User.findById({_id: req.params.user_id});
        const replays = await user.books.id(req.params.book_id).reviews.id(req.params.review_id).replays;
// provider_id: {type: mongoose.SchemaTypes.ObjectId, required: true},
//     replay: {type: String, required: true},
        const {provider_id, replay} = req.body;

        replays.push({
            provider_id: provider_id,
            replay: replay,

        });
        const saved_user = await user.save();

        sendJsonResponse(res, saved_user, 200);

    } catch (e) {
        sendJsonResponse(res, e.message, 200);

    }


}


module.exports.update = async (req, res, next) => {
    try {
        const user = await User.findById({_id: req.params.user_id});
        const replay = await user.books.id(req.params.book_id).reviews.id(req.params.review_id).replays.id(req.params.replay_id);
        replay.set(req.body);
        const update_replay = await user.save();
        sendJsonResponse(res, update_replay, 200);

    } catch (e) {
        sendJsonResponse(res, e.message, 200);

    }
}


module.exports.delete = async (req, res, next) => {
    try {
        const user = await User.findById({_id: req.params.user_id});
        const replay = await user.books.id(req.params.book_id).reviews.id(req.params.review_id).replays.id(req.params.replay_id);
        replay.remove();
        await user.save();
        sendJsonResponse(res, null, 400);
    } catch (e) {
        sendJsonResponse(res, e, 200);

    }
}


function sendJsonResponse(res, data, status) {
    res.status(status);
    res.send(data);
}
