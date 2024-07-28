const express = require('express')
const router = express.Router()

const tasks = require('../models/tasksModel')
const authenticateToken = require('../middlewares/authMiddleware')

const getStartDate = (range)=>{
    const now = new Date()
    let startDate

    switch(range){
        case '1h':
            startDate = new Date(now.getTime() - 1*60*60*1000)
            break;
        case '24h':
            startDate = new Date(now.getTime() - 24*60*60*1000)
            break;
        case '1w':
            startDate = new Date(now.getDate() - 7*24*60*60*1000)
            break;
        case '1m':
            startDate = new Date(now.getDate() - 30*24*60*60*1000)
            break;
        default:
            startDate = new Date(0)
            break;
    }

    return startDate
}

router.post('/create', authenticateToken, (req, res) => {

    const { title, description, status, deadline } = req.body;
    const { _id } = req.user.item;

    tasks.create({
        userId: _id,
        title,
        description,
        status,
        deadline
    }).then(
        todo => res.json(todo)
    ).catch(
        err => res.json(err)
    )
})

router.get('/all-tasks', authenticateToken, (req, res) => {
    tasks.find({ userId: req.user.item._id }).then((items) => {
        res.status(200).json(items)
    }).catch((err) => {
        res.status(500).json(err)
    })
})

router.get('/all-tasks-range', authenticateToken, (req, res) => {
    const {range} = req.query
    const startDate = getStartDate(range)
    tasks.find({ userId: req.user.item._id,created:{$gte:startDate} }).then((items) => {
        res.status(200).json(items)
    }).catch((err) => {
        res.status(500).json(err)
    })
})

router.delete('/delete-task/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;
    const userId = req.user.item._id;

    try {
        const task = await tasks.findOneAndDelete({ _id: id, userId: userId });

        if (!task) {
            return res.status(404).json({ message: 'Task not found or not authorized to delete this task' });
        }

        res.status(204).json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting task', error: err.message });
    }
});

router.get('/get-task/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;
    try {
        const task = await tasks.findOne({ userId: req.user.item._id, _id: id })

        if (!task) {
            return res.status(404).json({ error: 'Task not found' })
        }
        console.log(task)

        return res.status(200).json(task)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Error finding Task' })
    }
})

router.put('/edit-task/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;
    const { title, description, status, deadline } = req.body;

    try {
        const task = await tasks.findOneAndUpdate({ userId: req.user.item._id, _id: id }, {
            title,
            description,
            status,
            deadline
        },
            { new: true, runValidators: true })

        if (!task) {
            return res.status(404).json({ error: 'Task not found' })
        }
        console.log(task)

        return res.status(200).json(task)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Error finding Task' })
    }
})


module.exports = router
