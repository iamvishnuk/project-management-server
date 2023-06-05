const { createCategory, getCategoryData, deleteCategory } = require("../Controllers/category-controller")
const { emailVerification } = require("../Controllers/email-verification")
const { userRegisteration, userLogin } = require("../Controllers/user_controller")


const router = require("express").Router()

router.post("/signup", userRegisteration)
router.get("/user/:id/verify/:token",emailVerification)
router.post("/login",userLogin)
router.post("/create-category",createCategory)
router.get("/get-category-data",getCategoryData)
router.get("/delete-category",deleteCategory)


module.exports = router