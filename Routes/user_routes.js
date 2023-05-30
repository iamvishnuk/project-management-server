const { userRegisteration } = require("../Controllers/user_controller")

const router = require("express").Router()

router.post("/", userRegisteration)


module.exports = router