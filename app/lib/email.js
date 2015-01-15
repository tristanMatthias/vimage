var nodemailer = require("nodemailer");
var transport  = nodemailer.createTransport();
var jade       = require("jade");
var path       = require("path");


module.exports = function(to, subject, message, template) {
    console.log("TO", to, "subject", subject);
    var html = message;
    if (template) {
        console.log(message)
        html = jade.renderFile(path.resolve(__APPROOT__, "app/views/emails/",template + ".jade"), message);
    }

    transport.sendMail({
        from: "Vimage <noreply@vimage.io>",
        to: to,
        subject: subject,
        html: html
    }, console.error);
}