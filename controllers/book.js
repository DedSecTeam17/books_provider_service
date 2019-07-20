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
        const books = await user.books;
        sendJsonResponse(res, books, 200);
    } catch (e) {
        sendJsonResponse(res, e, 200);

    }

}


module.exports.allBooks= async (req,res,next)=>{
    try {
        const  allBooks=[];
        const users = await User.find({});
        for (let i = 0; i <users.length ; i++) {
            const user=users[i];
            for (let j = 0; j <user.books.length ; j++) {
                allBooks.push(  user.books[j]);
            }
        }
        sendJsonResponse(res, allBooks, 200);
    }catch (e) {
        sendJsonResponse(res, e, 200);

    }
}





module.exports.show = async (req, res, next) => {
    try {
        const user = await User.findById({_id: req.params.user_id});
        const books = await user.books.id(req.params.book_id);
        sendJsonResponse(res, books, 200);

    } catch (e) {
        sendJsonResponse(res, e, 200);

    }
}

module.exports.showWithOutUserId = async (req, res, next) => {
    try {
        let  book={};
        let user={};
        const users = await User.find({});
        for (let i = 0; i <users.length ; i++) {
             book=users[i].books.id(req.params.book_id);
             user=users[i];
        }
        sendJsonResponse(res, {
            "user_id":user._id,
            "_id":book._id,
            "title":book.title,
            "author":book.author,
            "reviews" : book.reviews,
            "publish_at":book.publish_at,
            "category_id":book.category_id,
            "price":book.price,
            "book_image_path":book.book_image_path,
        },200);
    }catch (e) {
        sendJsonResponse(res, e, 200);

    }
}


module.exports.create = async (req, res, next) => {


    if (req.headers && req.headers.authorization) {
        const authorization_header = req.headers.authorization;
        const size = authorization_header.length;

        // substring JWT string from header  with space to get clean token
        const user_token = authorization_header.substr(4, size);


        try {
            const decoded_user = jwt.verify(user_token, process.env.JWT_SECRET);

            const user = await User.findById({_id: decoded_user._id});
            const book = user.books;

            const {title, author, publish_at, category_id, price} = req.body;
            book.push({
                title: title,
                author: author,
                // book_image_path : book_image_path ,
                publish_at: publish_at,
                category_id: category_id,
                price: price
            });

            const saved_user = await user.save();

            sendJsonResponse(res, saved_user.books[saved_user.books.length-1], 200);



        } catch (e) {
            sendJsonResponse(res, e, 404);

        }
    } else {
        sendJsonResponse(res, {'message': 'Authorization header required'}, 200);
    }


}


module.exports.getBookImage = (req, res) => {
    res.status(200);
    res.sendfile('./public/uploads/books_images/' + req.params.book_name);
};

module.exports.uploadBookImage = async (req, res, next) => {


    if (req.headers && req.headers.authorization) {
        const authorization_header = req.headers.authorization;
        const size = authorization_header.length;

        // substring JWT string from header  with space to get clean token
        const user_token = authorization_header.substr(4, size);


        try {

            const decoded_user = jwt.verify(user_token, process.env.JWT_SECRET);

            upload(req, res, async (err) => {
                if (err) {
                    sendJsonResponse(res, err, 200);

                } else {
                    const user = await User.findById({_id: decoded_user._id});
                    const book = user.books.id(req.params.book_id);
                    if (typeof book.book_image_path === 'undefined') {
                        book.book_image_path = "https://serene-wave-76375.herokuapp.com/api/users/books/" + req.file.filename;

                    } else {
                        deleteFile('./public/uploads/books_images/' + book.book_image_path.replace('https://serene-wave-76375.herokuapp.com/api/users/books/', ''));
                        book.book_image_path = "https://serene-wave-76375.herokuapp.com/api/users/books/" + req.file.filename;
                    }
                    const saved_user = await user.save();
                    sendJsonResponse(res, saved_user, 200);

                }
            });

        } catch (e) {
            sendJsonResponse(res, e, 404);

        }
    } else {
        sendJsonResponse(res, {'message': 'Authorization header required'}, 200);
    }


}


module.exports.update = async (req, res, next) => {

    if (req.headers && req.headers.authorization) {
        const authorization_header = req.headers.authorization;
        const size = authorization_header.length;

        // substring JWT string from header  with space to get clean token
        const user_token = authorization_header.substr(4, size);


        try {
            // decode user model using jwt verify using client secret and and clean token
            const decoded_user = jwt.verify(user_token, process.env.JWT_SECRET);
            // find user using id from decoded user
            const user = await User.findById(decoded_user._id);

            const book = user.books.id(req.params.book_id);
            book.set(req.body);
            const saved_user = await user.save();

            sendJsonResponse(res, saved_user, 200);

        } catch (e) {
            sendJsonResponse(res, e, 404);

        }
    } else {
        sendJsonResponse(res, {'message': 'Authorization header required'}, 200);
    }


}


module.exports.delete = async (req, res, next) => {

    if (req.headers && req.headers.authorization) {
        const authorization_header = req.headers.authorization;
        const size = authorization_header.length;

        // substring JWT string from header  with space to get clean token
        const user_token = authorization_header.substr(4, size);


        try {

            // decode user model using jwt verify using client secret and and clean token
            const decoded_user = jwt.verify(user_token, process.env.JWT_SECRET);
            const user = await User.findById({_id: decoded_user._id});
            const books = await user.books.id(req.params.book_id);
            deleteFile('./public/uploads/books_images/' + books.book_image_path.replace('https://serene-wave-76375.herokuapp.com/api/users/books/', ''));
            books.remove();
            await user.save();
            sendJsonResponse(res, null, 200);
        } catch (e) {
            sendJsonResponse(res, e, 404);

        }
    } else {
        sendJsonResponse(res, {'message': 'Authorization header required'}, 200);
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


