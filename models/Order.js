const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
var uniqueValidator = require('mongoose-unique-validator');


// mongoose.SchemaTypes.ObjectId

var  orderLineSchema=new mongoose.Schema(
    {
        book_id: {type: mongoose.SchemaTypes.ObjectId, required: true},
        quantity: {type: String, required: true},
        price: {type: String, required: true}

    }
);

var orderSchema = new mongoose.Schema({
    provider_id: {type: mongoose.SchemaTypes.ObjectId, required: true},
    customer_id: {type: mongoose.SchemaTypes.ObjectId, required: true},
    user_location: {
        lat:{type: String, required: true},
        long:{type: String, required: true}
    },
    State: {type: String, required: true},
    order_lines : [orderLineSchema]
});

orderSchema.plugin(uniqueValidator);
orderSchema.plugin(timestamp);


var orderModle = mongoose.model("Order", orderSchema);
// expert the model

module.exports = orderModle;