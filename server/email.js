var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({ 
    service: 'gmail',
    host: 'smtpout.secureserver.net', 
    port: 465, 
    auth: { user: 'sigaufcg@gmail.com', pass: '101toppers' },
    secure: true
});

// send mail with defined transport object
exports.sendEmail = function(ed) {

    // setup email data with unicode symbols
    var mailOptions = {
        from: '"SIGA - Sistema de Gerênciamente de Água" <siga@ufcg.com>', // sender address
        to: 'rafaela9136@gmail.com', // list of receivers
        subject: 'Consumo suspeito', // Subject line
        text: "Olá!\n nós notamos que o prédio" + ed.nome + " está apresentando um consumo suspeito. Verifique assim que possível!\nCondialmente,\nSIGA", // plain text body
        html: '<p>Olá!</p>' + '<p>nós notamos que o prédio ' + ed.nome + 
              ' está apresentando um consumo suspeito. Verifique assim que possível!</p>'
              + '<p>Cordialmente,</p>' + '<p>SIGA.</p>' // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});}
