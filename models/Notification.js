const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
var uniqueValidator = require('mongoose-unique-validator');


// mongoose.SchemaTypes.ObjectId

var notificationSchema = new mongoose.Schema({
    provider_id: {type: mongoose.SchemaTypes.ObjectId, required: true},
    book_id: {type: mongoose.SchemaTypes.ObjectId, required: true},
    customer_id: {type: mongoose.SchemaTypes.ObjectId, required: true},
    content:{type: String , required : true}
});




notificationSchema.plugin(uniqueValidator);
notificationSchema.plugin(timestamp);


var notificationModel = mongoose.model("Notification", notificationSchema);
// expert the model

module.exports = notificationModel;