const nodemailer = require('nodemailer');

HOST = "smtp.gmail.com";
USER = "new.event.mail@gmail.com";
PASS = "BlegusMogus";
SERVICE = "google.com";

const sendEmail = async(email, subject, text) => {

    let testAccount = await nodemailer.createTestAccount();

    try {
        const transporter = nodemailer.createTransport({
            host: HOST,
            port: 465,
            secure: true,
            auth: {
                user: USER,
                pass: PASS
            }
        });

        await transporter.sendMail({
            from: USER,
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email envoyé");
    } catch (error) {
        console.log(error, "email non envoyé");
    }
};

//sendEmail("lespagnolcesttropbien@gmail.com", "TestJs", "Pitié que ça fonctionne");

module.exports = sendEmail;