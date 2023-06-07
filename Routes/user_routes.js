const { createCategory, getCategoryData, deleteCategory, editCategory } = require("../Controllers/category-controller")
const { emailVerification } = require("../Controllers/email-verification")
const { userRegisteration, userLogin } = require("../Controllers/user_controller")
const { userAuthentication } = require("../Middlewares/userAuth")
const router = require("express").Router()



router.post("/",userLogin)
router.post("/signup", userRegisteration)
router.get("/user/:id/verify/:token",emailVerification)

// PROJECT CATEGORY MANAGEMENT
router.post("/create-category",userAuthentication,createCategory)
router.get("/get-category-data",userAuthentication,getCategoryData)
router.get("/delete-category/:deleteCategoryId",userAuthentication,deleteCategory)
router.post("/edit-category",userAuthentication,editCategory)


module.exports = router