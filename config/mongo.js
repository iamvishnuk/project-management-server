const mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/project_management", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("connect to project_management")
}).catch(err => console.log("Error connecting to project_management" + err))