const Chat = require("../Model/chat-model")
const { uploadToCloudinary } = require("../utils/cloudinary")


module.exports.addChat = async (req, res) => {
    try {

        const { message, teamId } = req.body
        const userId = req.userId
        const messageObj = {
            message: message,
            from: userId,
            team: teamId
        }
        let data = await Chat.create(messageObj)
        data = await data.populate("from")
        res.status(200).json({ data, message: "message added successfully" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports.getAllMessage = async (req, res) => {
    try {
        const teamId = req.params.teamId
        const data = await Chat.find({ team: teamId }).populate("from")
        res.status(200).json({ message: data })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports.sendImgaeMessage = async (req, res) => {
    try {
        
        const userId = req.userId
        // upload image ot cloudinary
        const image = await uploadToCloudinary(req.file.path,"message-images")
        const mesgObj = {
            message: image.url,
            from: userId,
            team: req.params.teamId,
            publicId: image.public_id,
        }
        let data = await Chat.create(mesgObj)
        data = await data.populate("from")
        res.status(200).json({ data, message: "message added successfully" })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal server error"})
    }
}