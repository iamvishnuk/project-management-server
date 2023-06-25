const Users = require("../Model/user-model")
const Token = require("../Model/token-model")

const emailVerification = async (req, res) => {
    try {
        const { id } = req.params
        const user = await Users.findOne({ _id: id })
        if (!user) return res.status(400).json({ verified: false, message: "invalid like" })

        const token = await Token.findOne({ userId: id, token: req.params.token })
        if (!token) return res.status(400).json({ verified: false, message: "invalid lik" })

        await Users.updateOne({ _id: id }, { $set: { verified: true } })
        await Token.deleteOne({ token: req.params.token })

        res.status(200).json({ verified: true, message: "Email verified successfully" })

    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { emailVerification }