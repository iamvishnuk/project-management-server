const Category = require("../Model/category-model")
const Users = require("../Model/user-model")
const Project = require("../Model/projects-model")

// getting members adn category data for creating project
const getMemberAndCategory = async (req, res) => {
    try {
        const userId = req.userId
        const categoryDetails = await Category.find({ createBy: userId })
        const memberDetails = await Users.findOne({ _id: userId }).populate("member")
        res.status(200).json({ categoryDetails: categoryDetails, memberDetails: memberDetails.member })
    } catch (error) {
        res.status(500).json({ messgae: "Internal server error" })
    }
}

const createProject = async (req, res) => {
    try {
        const { projectName, projectCategory, projectUrl, projectLead, description } = req.body
        const userId = req.userId
        if (projectName === "" || projectCategory === "" || projectUrl === "" || projectLead === "" || description === "") {
            res.status(400).json({ message: "All field are required" })
        } else {
            const newProject = await new Project({
                projectName: projectName,
                projectCategory: projectCategory,
                projectUrl: projectUrl,
                projectLead: projectLead,
                description: description,
                createdBy: userId
            }).save()
            res.status(201).json({ message: "New project created successfully" })
        }

    } catch (error) {
        res.status(500).json({ message: "Interanl server error" })
    }
}

const getAllProjects = async (req, res) => {
    try {
        const userId = req.userId
        const projects = await Project.find({ $or: [{ createdBy: userId }, { projectLead: userId }, { members: { $in: [userId] } }] }).populate("projectLead").populate("projectCategory")
        res.status(200).json({ projectDetails: projects })
    } catch (error) {
        res.status(500).json({ message: "Interanl server error" })
    }
}

const deleteProject = async (req, res) => {
    try {
        const { id } = req.params
        await Project.deleteOne({ _id: id })
        res.status(200).json({ message: "Project as successfully deleted" })
    } catch (error) {
        res.status(500).json({ message: "Interanl server error" })
    }
}

const getEditProjectDetails = async (req, res) => {
    try {
        const { id } = req.params
        const projectData = await Project.findOne({ _id: id }).populate("projectCategory").populate("projectLead")
        res.status(200).json({ projectData: projectData })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const editProject = async (req, res) => {
    try {

        const projectId = req.body._id
        const projectName = req.body.projectName
        const projectCategory = req.body.projectCategory._id || req.body.projectCategory
        const projectUrl = req.body.projectUrl
        const projectLead = req.body.projectLead._id || req.body.projectLead
        const description = req.body.description
        await Project.updateOne(
            { _id: projectId },
            {
                $set:
                {
                    projectName: projectName,
                    projectCategory: projectCategory,
                    projectUrl: projectUrl,
                    projectLead: projectLead,
                    description: description
                }
            }
        )
        res.status(200).json({ message: "successfully update the project details" })

    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const getMembers = async (req, res) => {
    try {
        const userId = req.userId
        const data = await Users.findOne({ _id: userId }).populate("member")
        res.status(200).json({ data: data.member })
    } catch (error) {
        res.status(500).json({ message: "Interanl server error" })
    }
}

const setProjectAccessMember = async (req, res) => {
    try {
        const projectId = req.params.id
        const data = req.body
        const membersId = data.map(item => {
            return item.value
        })
        await Project.updateOne({ _id: projectId }, { $addToSet: { members: membersId } })
        res.status(200).json({ message: "New members added successfully" })

    } catch (error) {
        res.status(500).json({ message: "Interanl server error" })
    }
}

const getAcessMemberList = async (req, res) => {
    try {
        const projectId = req.params.projectId
        const data = await Project.findOne({ _id: projectId }).populate("members")
        res.status(200).json({ accessMemberList: data.members })
    } catch (error) {
        res.status(500).json({ message: "Interanl server error" })
    }
}

const removeAccess = async (req, res) => {
    try {
        const memberId = req.params.memberId
        const projectId = req.params.projectId
        await Project.updateOne({ _id: projectId }, { $pull: { members: memberId } })
        res.status(200).json({ message: "Removed project access" })
    } catch (error) {
        res.status(500).json({ message: "Interanl server error" })
    }
}


module.exports = {
    getMemberAndCategory,
    createProject,
    getAllProjects,
    deleteProject,
    getEditProjectDetails,
    editProject,
    getMembers,
    setProjectAccessMember,
    getAcessMemberList,
    removeAccess
}