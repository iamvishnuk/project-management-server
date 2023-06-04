const Users = require("../Model/user-model")
const Token = require("../Model/token-model")

const emailVerification = async (req, res) => {
    try {
        const{id} = req.params
        const user = await Users.findOne({_id: id})
        if(!user) return res.status(400).json({message:"invalid like"})

        const token = Token.findOne({userId: id, token: req.params.token})
        if(!token) return res.status(400).json({message: "invalid lik"})

        await Users.updateOne({_id: user._id, verified: true})
        await Token.deleteOne({token:req.params.token})

        res.status(200).json({message: "Email verified successfully"})
        
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {emailVerification}