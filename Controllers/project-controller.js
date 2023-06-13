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
        console.log(error)
        res.status(500).json({ messgae: "Internal server error" })
    }
}

const createProject = async (req, res) => {
    try {
        console.log(req.body)
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
        console.log(error)
        res.status(500).json({ message: "Interanl server error" })
    }
}

const getAllProjects = async (req, res) => {
    try {
        const userId = req.userId
        const projects = await Project.find({ $or: [{ createdBy: userId }, { projectLead: userId }] }).populate("projectLead").populate("projectCategory")
        res.status(200).json({ projectDetails: projects })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Interanl server error" })
    }
}

const deleteProject = async (req, res) => {
    try {
        const { id } = req.params
        await Project.deleteOne({ _id: id })
        res.status(200).json({ message: "Project as successfully deleted" })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Interanl server error" })
    }
}

const getEditProjectDetails = async (req, res) => {
    try {
        const { id } = req.params
        const projectData = await Project.findOne({ _id: id }).populate("projectCategory").populate("projectLead")
        res.status(200).json({ projectData: projectData })
    } catch (error) {
        console.log(error)
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
                    description:description
                }
            }
        )
        res.status(200).json({message: "successfully update the project details"})

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

const getMembers = async (req, res) => {
    try {
        const userId = req.userId
        const data = await Users.findOne({_id: userId}).populate("member")
        res.status(200).json({data: data.member})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: "Interanl server error"})
    }
}

const setProjectAccessMember = async (req, res) => {
    try {
        console.log(req.body)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: "Interanl server error"})
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
    setProjectAccessMember
}