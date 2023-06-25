const Event = require("../Model/events-model")

const createEvent = async (req, res) => {
    try {
        const { title, start, end, color, userId } = req.body
        if (title === "") {
            return res.status(400).json({ message: "Title is required" })
        } else {
            const newEvent = new Event({
                title: title,
                start: start,
                end: end,
                color: color,
                createdBy: userId
            })
            await newEvent.save()
            res.status(201).json({ message: "New event is added" })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal sever error" })
    }
}

const getEvent = async (req, res) => {
    try {
        const userId = req.params.userId
        const data = await Event.find({}).populate("createdBy")
        const eventData = data.filter(event => {
            const createdBy = event.createdBy._id.toString();
            const members = event.createdBy.member.map(member => member.toString());
            return createdBy === userId || members.includes(userId);
        });
        res.status(200).json({ eventData })
    } catch (error) {
        res.status(500).json({ message: "Interanl server error" })
    }
}

module.exports = {
    createEvent,
    getEvent,
}