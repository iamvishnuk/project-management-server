const mongoose = require("mongoose")
require("dotenv").config()

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("connect to project_management")
}).catch(err => console.log("Error connecting to project_management" + err))