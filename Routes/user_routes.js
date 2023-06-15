const { createCategory, getCategoryData, deleteCategory, editCategory } = require("../Controllers/category-controller")
const { emailVerification } = require("../Controllers/email-verification")
const { getMemberAndCategory, createProject, getAllProjects, deleteProject, getEditProjectDetails, editProject, getMembers, setProjectAccessMember, getAcessMemberList, removeAccess } = require("../Controllers/project-controller")
const { sendInviteMail, getAllPeople, createTeam, getTeam, removePeople, getSingleTeamData, removeTeamMember, addTeamMember } = require("../Controllers/team-controller")
const { userRegisteration, userLogin, forgotPasswordSendMail, forgotPasswordUrlVerify, forgotPasswordChangePassword, signupWithGoogle, loginWithGoogle, isUserAuth } = require("../Controllers/user_controller")
const { userAuthentication } = require("../Middlewares/userAuth")
const router = require("express").Router()


// USER ROUTES
router.post("/", userLogin)
router.post("/signup", userRegisteration)
router.get("/user/:id/verify/:token", emailVerification)
router.get("/forgot-password/:email", forgotPasswordSendMail)
router.get("/change-password/:id/verify/:token", forgotPasswordUrlVerify)
router.post("/change-password/:id", forgotPasswordChangePassword)
router.post("/google-signup", signupWithGoogle)
router.post("/google-login", loginWithGoogle)
router.get("/is-auth-user", userAuthentication, isUserAuth)

// PROJECT CATEGORY MANAGEMENT
router.post("/create-category", userAuthentication, createCategory)
router.get("/get-category-data", userAuthentication, getCategoryData)
router.get("/delete-category/:deleteCategoryId", userAuthentication, deleteCategory)
router.post("/edit-category", userAuthentication, editCategory)

// TEAM MANAGEMENT ROUTES
router.post("/send-invite-mail", userAuthentication, sendInviteMail)
router.get("/get-all-people", userAuthentication, getAllPeople)
router.post("/create-team",userAuthentication,createTeam)
router.get("/get-team",userAuthentication,getTeam)
router.get("/remove-people/:id",userAuthentication,removePeople)
router.get("/get-single-team/:id",userAuthentication,getSingleTeamData)
router.get("/remove-team-member/:teamId/:memberid",userAuthentication,removeTeamMember)
router.post("/add-team-memeber/:teamId",userAuthentication,addTeamMember)

// PROJECT MANAGEMENT ROUTES
router.get("/get-member-and-category", userAuthentication, getMemberAndCategory)
router.post("/create-project", userAuthentication, createProject)
router.get("/get-all-project", userAuthentication, getAllProjects)
router.get('/delete-project/:id', userAuthentication, deleteProject)
router.get("/get-edit-project-details/:id", userAuthentication, getEditProjectDetails)
router.post("/edit-project", userAuthentication, editProject)
router.get("/get-member",userAuthentication,getMembers)
router.post("/give-access/:id",userAuthentication,setProjectAccessMember)
router.get("/get-access-member-list/:projectId",userAuthentication,getAcessMemberList)
router.get("/remove-access/:memberId/:projectId",userAuthentication,removeAccess)


module.exports = router