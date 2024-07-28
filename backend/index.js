const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')


const app = express()
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://ayushdincere99:Ayush123@cluster0.12lncob.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

app.use(cors())
app.use(express.json())

const user = require('./models/userModel')
const loginRoute = require('./routes/users')
const tasksRoute = require('./routes/tasks')

app.use('',loginRoute)
app.use('/tasks', tasksRoute)

app.listen(4000, ()=>{
    console.log('Server is up and running')
})