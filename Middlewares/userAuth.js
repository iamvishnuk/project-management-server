const jwt = require("jsonwebtoken")

module.exports.userAuthentication = async (req, res, next) => {
    try {

        const token = req.headers.autherization?.split(" ")[1]
        console.log(token)
        next()

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}