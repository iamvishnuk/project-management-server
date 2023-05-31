const bycrpt = require("bcrypt")
const Users = require("../Model/user-model")

const userRegisteration = async (req, res) => {
    try {
        let { username, email, password } = req.body
        const alreadyExistingEmail = await Users.findOne({ email: email })

        if (alreadyExistingEmail) {
            res.json({ exist: true, error: "Email already exist" }) // status code 409
        } else {
            password = await bycrpt.hash(password,10)
            const userDetails = new Users({
                userName: username,
                email: email,
                password: password
            })
            userDetails.save()
            const userId = await Users.findOne({ email: email })
            res.status(201).json({ userId: userId._id, created: true })
        }
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: error.message, created: false });
    }
}

module.exports = {
    userRegisteration
}