const Team = require("../Model/team-model")
const Users = require("../Model/user-model")
const sendMail = require("../utils/sendEmail")


const sendInviteMail = async (req, res) => {
    try {
        const email = req.body.email
        const userId = req.userId
        const user = await Users.findOne({ email: email })
        if (user) {
            await Users.updateOne({ _id: userId }, { $push: { member: user._id } })
            await Users.updateOne({ _id: user._id }, { $push: { member: userId } })
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
    try {
        const userId = req.userId
        const teamDetails = await Users.findOne({ _id: userId }).populate("member")
        if (teamDetails) {
            res.status(200).json({ peopleData: teamDetails.member })
        } else {
            res.status(404).json({ peopleData: false })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internanl server error" })
    }
}

const createTeam = async (req, res) => {
    try {
        const userId = req.userId
        const { member, teamName } = req.body
        const membersId = member.map(data => {
            return data.value
        })
        console.log(membersId)
        const newTeam = await new Team({
            teamName: teamName,
            members: membersId,
            admin: userId
        }).save()
        res.status(201).json({ message: "New team created Successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Interanle server error" })
    }
}

const getTeam = async (req, res) => {
    try {
        const userId = req.userId
        const teamData = await Team.find({ $or: [{ admin: userId }, { memeber: { $in: [userId] } }] })
        res.status(200).json({ teamData: teamData })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Interanl server error" })
    }
}
// for removing the people form the your people list
const removePeople = async (req, res) => {
    try {
        const peopleId = req.params.id
        const userId = req.userId
        await Users.updateOne({ _id: userId }, { $pull: { member: peopleId } })
        res.status(200).json({ message: "Removed successfully" })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}

const getSingleTeamData = async (req, res) => {
    try {
        console.log("function called ")
        const teamId = req.params.id
        const team = await Team.findOne({ _id: teamId }).populate("members")
        res.status(200).json({ team })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Interanl server error" })
    }
}

//for removing the peopel form the your team
const removeTeamMember = async (req, res) => {
    try {
        const { teamId, memberid } = req.params
        await Team.updateOne({ _id: teamId }, { $pull: { members: memberid } })
        res.status(200).json({ message: "Removed one memeber" })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Interanl server error" })
    }
}

const addTeamMember = async (req, res) => {
    try {
        const teamId = req.params.teamId
        const { member } = req.body
        console.log(req.body, req.params)
        const membersId = member.map(data => {
            return data.value
        })
        await Team.updateOne({ _id: teamId }, { $addToSet: { members: membersId } })
        res.status(200).json({ message: "New members added" })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Interanl server error" })
    }
}

module.exports = {
    sendInviteMail,
    getAllPeople,
    createTeam,
    getTeam,
    removePeople,
    getSingleTeamData,
    removeTeamMember,
    addTeamMember
}