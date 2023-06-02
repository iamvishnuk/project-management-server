const bycrpt = require("bcrypt")
const Users = require("../Model/user-model")
const Token = require("../Model/token-model")
const sendMail = require("../utils/sendEmail")
const crypto = require("crypto")


const userRegisteration = async (req, res) => {
    try {
        let { username, email, password } = req.body
        const alreadyExistingEmail = await Users.findOne({ email: email })

        if (alreadyExistingEmail) {
            res.json({ exist: true, error: "Email already exist" }) // status code 409
        } else {
            password = await bycrpt.hash(password, 10)
            const userDetails = await new Users({
                userName: username,
                email: email,
                password: password
            }).save()

            const token = await new Token({
                userId: userDetails._id,
                token: crypto.randomBytes(32).toString("hex")
            }).save()

            const url = `http://localhost:5173/user/${userDetails._id}/verify/${token.token}`
            await sendMail(email,"Verfity Email",url)
            res.status(201).json({ userId: response._id, created: true })
        }
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: error.message, created: false });
    }
}

module.exports = {
    userRegisteration
}