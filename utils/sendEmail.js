const nodemailer = require("nodemailer")
require('dotenv').config()

module.exports = async (email, subject, text) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: 587,
            auth: {
                user: process.env.USER, // generated ethereal user
                pass: process.env.PASS, // generated ethereal password
            },
        });

        let info = await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text
        })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}