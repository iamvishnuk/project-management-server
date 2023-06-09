const Board = require("../Model/board-model")
const projectsModel = require("../Model/projects-model")

const createBoard = async (req, res) => {
    try {
        const { boardName, projectId } = req.body
        if (boardName == "") {
            res.status(400).json({ message: "Please enter the board Name" })
        } else {
            await new Board({
                boardName: boardName,
                projectId: projectId
            }).save()
            res.status(201).json({ message: "New board created" })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const getBoardData = async (req, res) => {
    try {
        const projectId = req.params.projectId
        const boardData = await Board.find({ projectId: projectId })
            .populate({
                path: 'task.comments.userId',
                model: 'user',
            })
            .populate('task.assignee');
        res.status(200).json({ boardData: boardData })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const deleteBoard = async (req, res) => {
    try {
        const boardId = req.params.boardId
        await Board.deleteOne({ _id: boardId })
        res.status(200).json({ message: "Board deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const createNewTask = async (req, res) => {
    try {
        const { projectId, boardId } = req.params
        const { taskType, shortSummary, description, assignee, priority, workHours } = req.body
        const generateQniqueNumber = () => {
            return Math.floor(Date.now() * Math.random() * 10)
        }
        if (taskType === null || shortSummary === "" || priority === null || workHours === null) {
            res.status(400).json({ message: "Task type, short summary, work hours and priority are required" })
        } else {
            await Board.updateOne(
                { _id: boardId, projectId: projectId },
                {
                    $push:
                    {
                        task:
                        {
                            taskType: taskType,
                            shortSummary: shortSummary,
                            description: description,
                            assignee: assignee,
                            priority: priority,
                            workHours: workHours,
                            taskId: generateQniqueNumber()
                        }
                    }
                })
            res.status(201).json({ message: "New task added" })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const dragAndDropTask = async (req, res) => {
    try {
        const { destination, source, projectId } = req.body
        const userId = req.userId

        const sourceBoard = await Board.findOne({ projectId: projectId, boardName: source.droppableId })
        const sourceObject = sourceBoard.task.find(task => task.taskId === source.index)
        if (sourceObject && sourceObject.assignee === null) {
            sourceObject.assignee = userId;
        }

        await Board.updateOne(
            { boardName: destination.droppableId, projectId: projectId },
            {
                $push: { task: sourceObject }
            }
        )

        await Board.updateOne(
            { boardName: source.droppableId, projectId: projectId },
            { $pull: { task: { taskId: source.index } } }
        );
        res.status(200).json({ updated: true })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const editTask = async (req, res) => {
    try {
        const { value, boardName, taskId, fieldName } = req.body
        const updateObject = {
            [`task.$.${fieldName}`]: value.value || value
        };
        await Board.updateOne(
            {
                boardName,
                'task._id': taskId
            },
            {
                $set: updateObject
            }
        )
        res.status(200).json({ updated: true })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const getBoardNames = async (req, res) => {
    try {
        const boardNames = await Board.find({})
        const result = boardNames.map(board => board.boardName)
        res.status(200).json({ boardNames: result, message: "res send" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const changeBoard = async (req, res) => {
    try {
        const { source, destination, taskId } = req.body
        const sourceBoard = await Board.findOne({ boardName: source })
        const sourceObject = sourceBoard.task.find(task => task.taskId === taskId)
        await Board.updateOne(
            { boardName: destination },
            {
                $push: { task: sourceObject }
            }
        )
        await Board.updateOne(
            { boardName: source },
            { $pull: { task: { taskId: taskId } } }
        );
        res.status(200).json({ updated: true })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const addComment = async (req, res) => {
    try {
        const { comment, userId, boardName, taskId } = req.body
        if (comment === "") {
            res.status(400).json({ message: "Please enter the command" })
        } else {
            await Board.updateOne(
                { boardName: boardName, "task.taskId": taskId },
                {
                    $push: {
                        "task.$.comments": {
                            userId: userId,
                            message: comment
                        }
                    }
                }
            )
            res.status(200).json({ commented: true })
        }

    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const deleteTask = async (req, res) => {
    try {
        const { boardName, taskId } = req.params
        await Board.updateOne(
            { boardName: boardName },
            { $pull: { task: { taskId: taskId } } }
        );
        res.status(200).json({ deleted: true })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const deleteComment = async (req, res) => {
    try {
        const { boardName, taskId, commentId } = req.params
        await Board.updateOne(
            {
                boardName: boardName,
                "task.taskId": taskId
            },
            {
                $pull: {
                    "task.$.comments": {
                        _id: commentId
                    }
                }
            }
        )

        res.status(200).json({ deleted: true })

    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const changeTimeSpend = async (req, res) => {
    try {
        const { value, boardName, taskId, fieldName, workHours } = req.body
        if (Number(value) > workHours) {
            res.status(400).json({ message: "Time spend is greater than the work hour" })
        } else {
            const updateObject = {
                [`task.$.${fieldName}`]: value.value || value
            };
            await Board.updateOne(
                {
                    boardName,
                    'task._id': taskId
                },
                {
                    $set: updateObject
                }
            )
            res.status(200).json({ updated: true })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const assignedToMe = async (req, res) => {
    try {
        const userId = req.userId
        const userProject = await projectsModel.find({ $or: [{ createdBy: userId }, { projectLead: userId }, { members: { $in: [userId] } }] })
        const data = await Promise.all(userProject.map(async (item) => {
            return await Board.find({
                projectId: item._id,
                "task.assignee": userId
            }).populate("projectId");
        }));
        res.status(200).json({ assignedTask: data })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}


module.exports = {
    createBoard,
    getBoardData,
    deleteBoard,
    createNewTask,
    dragAndDropTask,
    editTask,
    getBoardData,
    getBoardNames,
    changeBoard,
    addComment,
    deleteTask,
    deleteComment,
    changeTimeSpend,
    assignedToMe
}