const Notification = require('../models/Notification');
require('dotenv').config()


module.exports.index = async (req, res, next) => {

    try {
        const notifications = await Notification.find({provider_id: req.params.provider_id});

        sendJsonResponse(res, notifications, 200);
    } catch (e) {
        sendJsonResponse(res, e, 200);

    }
}
module.exports.show = async (req, res, next) => {
    try {
        const notification = await Notification.findById({_id: req.params.notification_id});
        sendJsonResponse(res, notification, 200);
    } catch (e) {
        sendJsonResponse(res, e, 200);

    }
}


module.exports.create = async (req, res, next) => {

    const {
        provider_id,
        book_id,
        customer_id,
        content,
    } = req.body;

    try {
        const notification = Notification(
            {
                provider_id: provider_id,
                book_id: book_id,
                customer_id: customer_id,
                content: content,
            }
        );

        const saved_notification = await notification.save();

        sendJsonResponse(res, saved_notification, 200);

    } catch (e) {
        sendJsonResponse(res, e.message, 200);

    }


}


module.exports.update = async (req, res, next) => {
    try {
        const notification = await Notification.findOneAndUpdate({_id: req.params.notification_id}, req.body);

        sendJsonResponse(res, notification, 200);
    } catch (e) {
        sendJsonResponse(res, e.message, 200);

    }
}


module.exports.delete = async (req, res, next) => {
    try {
        const notification = await Notification.findOneAndRemove({_id: req.params.notification_id});

        sendJsonResponse(res, null, 200);

    } catch (e) {
        sendJsonResponse(res, e, 200);

    }
}


function sendJsonResponse(res, data, status) {
    res.status(status);
    res.send(data);
}


