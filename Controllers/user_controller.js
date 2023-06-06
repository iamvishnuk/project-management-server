const bycrpt = require("bcrypt")
const Users = require("../Model/user-model")
const Token = require("../Model/token-model")
const sendMail = require("../utils/sendEmail")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
require("dotenv").config()


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

            console.log(token.token)

            const url = `http://localhost:5173/user/${userDetails._id}/verify/${token.token}`
            await sendMail(email, "Verfity Email", url)
            res.status(200).json({ userId: userDetails._id, created: true, message: "A verification like send to email" })
        }
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: error.message, created: false });
    }
}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await Users.findOne({ email: email })
        console.log(user)
        if (user === null) {
            return res.status(404).json({ logedIn: false, message: "Invalid emaild" })
        } else {
            const status = bycrpt.compare(password, user.password)
            if (status) {
                const userId = user._id
                const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: 300000 })

                return res.status(200).json({ logedIn: true, token: token, userId: user._id, message: "Successfully Loged In" })
            } else {
                return res.status(404).send({ logedIn: false, message: "Wrong password" })
            }
        }

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    userRegisteration,
    userLogin,
}