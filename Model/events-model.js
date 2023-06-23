const mongoose = require("mongoose")
const schedule = require("node-schedule")

const eventDate = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    color: {
        type: String,
        required: true,
        default: "#2464f9"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
})

const Event = mongoose.model("event", eventDate);

// Schedule a job to delete expired events
const deleteExpiredEvents = schedule.scheduleJob("0 11 * * *", async () => {
    try {
        // Find events where the end date/time is in the past
        const expiredEvents = await Event.find({
            end: { $lt: new Date() }
        });

        // Delete expired events
        await Event.deleteMany({
            _id: { $in: expiredEvents.map(event => event._id) }
        });

        console.log(`Deleted ${expiredEvents.length} expired events.`);
    } catch (error) {
        console.error("Error deleting expired events:", error);
    }
});

module.exports = Event;