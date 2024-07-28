const express = require('express')
const router  = express.Router()

const tasks = require('../models/tasksModel')
const authenticateToken = require('../middlewares/authMiddleware')

router.post('/create',authenticateToken,(req,res)=>{

    const { title, description, status, deadline } = req.body;
    const { _id } = req.user.item;

    tasks.create({
        userId:_id,
        title,
        description,
        status,
        deadline
    }).then(
        todo => res.json(todo)
    ).catch(
        err => res.json(err)
    )
    // res.status(201).json({
    //     message: 'Task created successfully',
    // })
})

router.get('/all-tasks', authenticateToken,(req,res)=>{
    tasks.find({userId: req.user.item._id}).then((items)=>{
        res.status(200).json(items)
    }).catch((err)=>{
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

router.get('/get-task/:id', authenticateToken,(req,res)=>{
    const id = req.params.id;
    try {
        const task = tasks.findOne({userId: req.user.item._id,_id:id})

        if(!task){
            return res.status(404).json({error:'Task not found'})
        }

        return res.status(200).json(res.json(task))
    }
    catch(err){
        res.status(500).json({message:'Error finding Task'})
    }
})


module.exports = router
