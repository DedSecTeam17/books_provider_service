const Chat = require('../models/Chat');
require('dotenv').config()


module.exports.index = async (req, res, next) => {

    try {
        const chats = await Chat.find({provider_id: req.params.provider_id,customer_id: req.params.customer_id});

        sendJsonResponse(res, chats, 200);
    } catch (e) {
        sendJsonResponse(res, e, 200);

    }
}


module.exports.show = async (req, res, next) => {
    try {
        const chat = await Chat.findById({_id: req.params.chat_id});
        sendJsonResponse(res, chat, 200);
    } catch (e) {
        sendJsonResponse(res, e, 200);

    }
}


module.exports.create = async (req, res, next) => {

    const {
        provider_id,
        message_from,
        message_to,

        customer_id,
        message,
    } = req.body;

    try {
        const chat = Chat(
            {
                provider_id: provider_id,
                customer_id: customer_id,
                message_from:message_from,
                message_to:message_to,
                message: message,
            }
        );

        const saved_chat = await chat.save();

        sendJsonResponse(res, saved_chat, 200);

    } catch (e) {
        sendJsonResponse(res, e.message, 200);

    }


}


module.exports.update = async (req, res, next) => {
    try {
        const chat = await Chat.findOneAndUpdate({_id: req.params.chat_id}, req.body);

        sendJsonResponse(res, chat, 200);
    } catch (e) {
        sendJsonResponse(res, e.message, 200);

    }
}


module.exports.delete = async (req, res, next) => {
    try {
        const chat = await Chat.findOneAndRemove({_id: req.params.chat_id});

        sendJsonResponse(res, null, 200);

    } catch (e) {
        sendJsonResponse(res, e, 200);

    }
}


function sendJsonResponse(res, data, status) {
    res.status(status);
    res.send(data);
}


