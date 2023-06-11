const Category = require("../Model/category-model")
const Users = require("../Model/user-model")


const getMemberAndCategory = async(req, res) => {
    try {
        const userId = req.userId
        const categoryDetails = await Category.find({createBy: userId})
        const memberDetails = await Users.findOne({_id: userId}).populate("member")
        console.log(categoryDetails, memberDetails)
        res.status(200).json({categoryDetails: categoryDetails, memberDetails: memberDetails.member})
    } catch (error) {
        console.log(error)
        res.status(500).json({messgae: "Internal server error"})
    }
}

module.exports = {
    getMemberAndCategory
}