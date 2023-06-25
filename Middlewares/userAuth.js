const jwt = require("jsonwebtoken")
require("dotenv").config()

module.exports.userAuthentication = async (req, res, next) => {
    try {

        const token = req.headers.authorization?.split(" ")[1]
        if(!token) {
            res.json({auth: false, message:"There is no token"})
        } else {
            jwt.verify(token, process.env.JWT_SECRET_KEY,(err,decode) => {
                if(err) {
                    res.status(500).json({ auth: false, message: "Invalid token"})
                } else {
                    req.userId = decode.userId
                    next()
                }
            })
        }

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}