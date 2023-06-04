const { emailVerification } = require("../Controllers/email-verification")
const { userRegisteration, userLogin } = require("../Controllers/user_controller")


const router = require("express").Router()

router.post("/signup", userRegisteration)
router.get("/user/:id/verify/:token",emailVerification)
router.post("/login",userLogin)


module.exports = router