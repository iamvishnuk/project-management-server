const nodemailer = require("nodemailer")

module.exports = async (email, subject, text) => {
    try {
        let testAccount = await nodemailer.createTestAccount()

        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });

        let info = await transporter.sendMail({
            from: "vishnu@gmail.com ",
            to: email,
            subject: subject,
            text: text
        })
        console.log("email send successfully")
        console.log(info.messageId)
    } catch (error) {
        console.log("something went wrong")
        console.log(error)
    }
}