const User = require("../Model/user-model")

module.exports = async (title, message, userId) => {
    try {
        await User.updateOne(
            { _id: userId },
            {
                $push:
                {
                    notification: {
                        title: title,
                        message: message
                    }
                }
            }
        )
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error })
    }

} 