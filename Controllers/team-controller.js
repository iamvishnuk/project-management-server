const Users = require("../Model/user-model")
const sendMail = require("../utils/sendEmail")


const sendInviteMail = async (req, res) => {
    try {
        const email = req.body.email
        const userId = req.userId
        const user = await Users.findOne({ email: email })
        if (user) {
            await Users.updateOne({ _id: userId }, { $push: { member: user._id } })
            const subject = "You are add to a new team please check the you project management application"
            await sendMail(email, "Added to new Team", subject)
            res.status(200).json({ add: true, message: "Successfully send mail" })
        } else {
            res.status(404).json({ add: false, message: "There is not such user exist" })
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ status: false, message: "Internal server error" })
    }
}

const getAllPeople = async (req, res) => {
    try{
        const userId = req.userId
        const teamDetails = await Users.findOne({_id: userId}).populate("member")
        if(teamDetails) {
            res.status(200).json({peopleData: teamDetails.member})
        } else {
            res.status(404).json({peopleData: false})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internanl server error"})
    }
}

module.exports = {
    sendInviteMail,
    getAllPeople
}