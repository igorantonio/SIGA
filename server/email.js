var nodemailer = require('nodemailer');

var edificio = "none";

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({ 
    service: 'gmail',
    host: 'smtpout.secureserver.net', 
    port: 465, 
    auth: { user: 'sigaufcg@gmail.com', pass: '101toppers' },
    secure: true
});

// setup email data with unicode symbols
var mailOptions = {
    from: '"SIGA - Sistema de Gerênciamente de Água" <siga@ufcg.com>', // sender address
    to: 'rafaela9136@gmail.com', // list of receivers
    subject: 'Hello', // Subject line
    text: 'Its me you looking for? '  + edificio.nome, // plain text body
    html: '<b>It is me you are looking for?</b>' // html body
};

// send mail with defined transport object

exports.sendEmail = function(ed) {
    edificio = ed;

    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});}
