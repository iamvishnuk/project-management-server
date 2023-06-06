const { createCategory, getCategoryData, deleteCategory } = require("../Controllers/category-controller")
const { emailVerification } = require("../Controllers/email-verification")
const { userRegisteration, userLogin } = require("../Controllers/user_controller")
const { userAuthentication } = require("../Middlewares/userAuth")


const router = require("express").Router()

router.post("/signup", userRegisteration)
router.get("/user/:id/verify/:token",emailVerification)
router.post("/",userLogin)
router.post("/create-category",userAuthentication,createCategory)
router.get("/get-category-data",userAuthentication,getCategoryData)
router.get("/delete-category/:deleteCategoryId",deleteCategory)


module.exports = router