var express = require('express');
var router = express.Router();



const restify_jwt = require('restify-jwt-community');
require('dotenv').config()


const  UsersController=require('../controllers/user');

//user_id


router.post('/users/:user_id/profile',restify_jwt({secret: process.env.JWT_SECRET}), UsersController.createProfile);
router.post('/users/:user_id/profile/upload_profile_image',restify_jwt({secret: process.env.JWT_SECRET}), UsersController.uploadProfileImage);
router.post('/users', UsersController.signUp);
router.post('/auth', UsersController.signIn);
router.get('/users', restify_jwt({secret: process.env.JWT_SECRET}),UsersController.getUser);
router.get('/users/profile_image/:image_name',UsersController.getProfileImage);
router.post('/users/password_reset',UsersController.passwordReset);
router.post('/users/password_change/:token',UsersController.passwordChange);

module.exports = router;
