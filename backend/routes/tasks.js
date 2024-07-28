const express = require('express')
const router  = express.Router()

const tasks = require('../models/tasksModel')
const authenticateToken = require('../middlewares/authMiddleware')

router.post('/create',authenticateToken,(req,res)=>{

    const payload = req.body.payload
    const taskData = {
        ...payload,
        user: req.user.userId,
        created: new Date()
    }

    tasks.create(taskData).then(
        todo => res.json(todo)
    ).catch(
        err => res.json(err)
    )
    res.status(201).json({
        message: 'Task created successfully',
    })
})

router.get('/tasks', authenticateToken,(req,res)=>{
    tasks.find({userId: req.user.userId}).then((items)=>{
        res.status(200).json(items)
    }).catch((err)=>{
        res.status(500).json(err)
    })
})


module.exports = router
