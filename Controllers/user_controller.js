const bcrypt = require("bcrypt")
const Users = require("../Model/user-model")
const Token = require("../Model/token-model")
const sendMail = require("../utils/sendEmail")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const { uploadToCloudinary, removeFromCloudinary } = require("../utils/cloudinary")


const userRegisteration = async (req, res) => {
    try {
        let { username, email, password } = req.body
        const alreadyExistingEmail = await Users.findOne({ email: email })

        if (alreadyExistingEmail) {
            res.json({ exist: true, error: "Email already exist" }) // status code 409
        } else {
            password = await bcrypt.hash(password, 10)
            const userDetails = await new Users({
                userName: username,
                email: email,
                password: password
            }).save()

            const token = await new Token({
                userId: userDetails._id,
                token: crypto.randomBytes(32).toString("hex")
            }).save()

            const url = `https://keen-mermaid-00ab86.netlify.app/${userDetails._id}/verify/${token.token}`
            await sendMail(email, "Verfity Email", url)
            res.status(200).json({ userId: userDetails._id, created: true, message: "A verification like send to email" })
        }
    } catch (error) {
        res.status(500).json({ error: error.message, created: false });
    }
}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await Users.findOne({ email: email })
        if (user === null) {
            return res.status(404).json({ logedIn: false, message: "Invalid emaild" })
        } else {

            if (user.verified) {

                const status = await bcrypt.compare(password, user.password)
                if (status) {
                    const userId = user._id
                    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: 300000 })

                    return res.status(200).json({ logedIn: true, token: token, userId: user._id, userName: user.userName, message: "Successfully Loged In" })
                } else {
                    return res.status(404).send({ logedIn: false, message: "Wrong password" })
                }

            } else {

                const token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString("hex")
                }).save()

                const url = `https://keen-mermaid-00ab86.netlify.app/${user._id}/verify/${token.token}`
                await sendMail(email, "Verfity Email", url)

                return res.status(404).json({ message: "Account not verified, sending verification mail please verify" })
            }
        }

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const forgotPasswordSendMail = async (req, res) => {
    try {
        const email = req.params.email
        const user = await Users.findOne({ email: email })
        if (!user) res.status(404).json({ status: false, message: "User not exist with this email" })

        const token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex")
        }).save()

        const url = `http://localhost:5173/change-password/${user._id}/verify/${token.token}`
        await sendMail(email, "Change password link", url)
        res.status(200).json({ status: true, message: "Verification mail send Successfully" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const forgotPasswordUrlVerify = async (req, res) => {
    try {

        const { id, token } = req.params
        const validUrl = await Token.findOne({ userId: id, token: token })
        if (!validUrl) return res.status(404).json({ auth: false, message: "invalid url" })
        await Token.deleteOne({ token: token })
        res.status(200).json({ auth: true, message: "Valid url" })

    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const forgotPasswordChangePassword = async (req, res) => {
    try {
        const userId = req.params.id
        let { newPassword } = req.body
        const user = await Users.findOne({ _id: userId })
        if (user) {
            const passwordMatch = await bcrypt.compare(newPassword, user.password)
            if (passwordMatch) {
                res.status(304).json({ updated: false, message: "New password and the old password are the same" })
            } else {
                newPassword = await bcrypt.hash(newPassword, 10)
                await Users.updateOne({ _id: userId }, {
                    $set: {
                        password: newPassword
                    }
                })
                res.status(200).json({ updated: true, message: "Password has been changed successfully" })
            }
        } else {
            res.status(404).json({ message: "User not found" })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

// google signup and login

const signupWithGoogle = async (req, res) => {
    try {
        const { name, email, email_verified, sub, picture } = req.body
        const user = await new Users({
            userName: name,
            email: email,
            verified: email_verified,
            password: sub,
            image: picture
        }).save()
        const userId = user._id
        const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: 300000 })
        return res.status(200).json({ logedIn: true, token: token, userId: user._id, userName: user.userName, message: "Successfully Loged In" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const loginWithGoogle = async (req, res) => {
    try {
        const { email, sub } = req.body
        const user = await Users.findOne({ email: email, password: sub })
        if (user !== null) {
            const userId = user._id
            const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: 300000 })
            res.status(200).json({ logedIn: true, token: token, userId: userId, userName: user.userName, message: "Successfully Loged In" })
        } else {
            res.status(404).json({ logedIn: false, message: "User not found" })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const isUserAuth = async (req, res) => {
    try {
        const user = await Users.findOne({ _id: req.userId })
        if (user !== null) {
            res.status(200).json({ auth: true, userDeatils: user })
        } else {
            res.status(404).json({ auth: false })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const getUserDetails = async (req, res) => {
    try {
        const userId = req.params.userId
        const userDetails = await Users.findOne({ _id: userId })
        res.status(200).json({ userDetails })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const editUserDetails = async (req, res) => {
    try {
        const { value, fieldName } = req.body
        const userId = req.userId
        const updateObject = { [`${fieldName}`]: value }

        await Users.updateOne(
            { _id: userId },
            { $set: updateObject }
        )
        res.status(200).json({ updated: true })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const uploadImage = async (req, res) => {
    try {
        const userId = req.userId
        const userData = await Users.findOne({ _id: userId })
        // if the user already having the profile picture then remove and upload the new image
        if (userData.publicId) {
            const publicId = userData.publicId
            await removeFromCloudinary(publicId)
        }
        //upload Image ot cloudinary
        const data = await uploadToCloudinary(req.file.path, "user-images")
        // save Image Url and publicId to the database
        await Users.updateOne(
            { _id: userId },
            {
                $set: {
                    image: data.url,
                    publicId: data.public_id
                }
            }
        )
        res.status(200).json({ message: "User image uploaded successfully" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const getAllNotification = async (req, res) => {
    try {
        const userId = req.userId
        const data = await Users.findOne({ _id: userId },)
        res.status(200).json({ notifications: data.notification })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = {
    userRegisteration,
    userLogin,
    forgotPasswordSendMail,
    forgotPasswordUrlVerify,
    forgotPasswordChangePassword,
    signupWithGoogle,
    loginWithGoogle,
    isUserAuth,
    getUserDetails,
    editUserDetails,
    uploadImage,
    getAllNotification
}