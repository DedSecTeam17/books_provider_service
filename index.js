const restify = require('restify');
const mongoose = require('mongoose');
const  restify_jwt=require('restify-jwt-community');
require('dotenv').config()
const express = require('express');
const  corsMiddleware =require('resti')
const app = express();
const  cors=require('cors');

var  user_route=require('./routes/user');
var  book_route=require('./routes/book');
var  order_route=require('./routes/order');
var  notification_route=require('./routes/notification');
var  chat_route=require('./routes/chat');
var  review_route=require('./routes/review');
var  replay_route=require('./routes/replay');





const bodyParser = require('body-parser');


app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));





const server = restify.createServer();
server.use(restify.plugins.bodyParser());


// protect all routes unless registration and login entry point
// server.use(restify_jwt({secret: process.env.JWT_SECRET}).unless({path:['/auth']}));

// when server listen connect to the data base
app.listen(process.env.PORT || 5000, () => {
    mongoose.set('useFindAndModify',false);
    mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true}).then(()=>{
        console.log("Connected")
    });
});


const db = mongoose.connection;


db.on('error', (error) => {
    console.log(error)
});


// app.post('/uploadimage',(req,res)=>{

// // });


// // if we have connection opened then require route file
db.on('open', () => {
    // require('./routes/customers')(server);
    // require('./routes/user')(server);
    // require('./routes/post')(server);
    // require('./routes/comment')(server);



    app.use('/api',user_route);
    app.use('/api',book_route);
    app.use('/api',order_route);
    app.use('/api',notification_route);
    app.use('/api',chat_route);
    app.use('/api',review_route);
    app.use('/api',replay_route);

    console.log(`server start on port ---> ${process.env.PORT}`);
});
