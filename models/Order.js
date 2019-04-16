const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
var uniqueValidator = require('mongoose-unique-validator');


// mongoose.SchemaTypes.ObjectId

var orderSchema = new mongoose.Schema({
    provider_id: {type: mongoose.SchemaTypes.ObjectId, required: true},
    book_id: {type: mongoose.SchemaTypes.ObjectId, required: true},
    customer_id: {type: mongoose.SchemaTypes.ObjectId, required: true},
    quantity: {type: String, required: true},
    user_location: {
        lat:{type: String, required: true},
        long:{type: String, required: true}
    },
    State: {type: String, required: true},
    total_price: {type: String, required: true}
});




orderSchema.plugin(uniqueValidator);
orderSchema.plugin(timestamp);


var orderModle = mongoose.model("Order", orderSchema);
// expert the model

module.exports = orderModle;