const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    title: {type: String, required: true},
    description: String,
    status: String,
    created: {type: Date, default: Date.now},
    deadline: Date
})

module.exports = mongoose.model('tasks', taskSchema)