const nodemailer = require('nodemailer');

HOST = "new.event.mail@gmail.com";
USER = "new.event.mail@gmail.com";
PASS = "BlegusMogus";
SERVICE = "google.com";

const sendEmail = async(email, subject, text) => {

    let testAccount = await nodemailer.createTestAccount();

    try {
        const transporter = nodemailer.transporter({
            host: "smtp.ethereal.email",
            //service: SERVICE,
            port: 587,
            secure: true,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        await transporter.sendEmail({
            from: '"Yo FOO" <foo@aled.com>',
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email envoyé");
    } catch (error) {
        console.log(error, "email non envoyé");
    }
};

module.exports = sendEmail;