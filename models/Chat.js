const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
var uniqueValidator = require('mongoose-unique-validator');


// mongoose.SchemaTypes.ObjectId

var chatSchema = new mongoose.Schema({
    provider_id: {type: mongoose.SchemaTypes.ObjectId, required: true},
    customer_id: {type: mongoose.SchemaTypes.ObjectId, required: true},
    message:{type: String , required : true}
});




chatSchema.plugin(uniqueValidator);
chatSchema.plugin(timestamp);


var chatModel = mongoose.model("Chat", chatSchema);
// expert the model

module.exports = chatModel;