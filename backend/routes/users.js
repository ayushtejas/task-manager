const express = require('express')
const router  = express.Router()
const jwt = require('jsonwebtoken')
const secretKey = 'secretkey'


const user = require('../models/userModel')

router.post('/login',(req,res)=>{

    const {email,password} = req.body

    user.findOne({email: email})
    .then(item=>{
        if (item){
            if(item.comparePassword(password)){
                jwt.sign({item}, secretKey,{expiresIn: '5h'},(err,token) => {
                    res.status(201).json({
                        message: 'User logged in successfully',
                        data: {
                            name: `${item.firstName} ${item.lastName}`,
                            email: item.email,
                            token: token
                        }
                    })
                })
            }
            else{
                res.json("Incorrect Password")
            }
        }
        else{
            res.json("No record found")
        }
    })
})

router.post('/register',(req,res)=>{
    user.create(req.body.payload).then(
        users => res.json(users)
    ).catch(err=> res.json(err))
    res.status(201).json({
        message: 'User registered successfully',
        data: {
            name: 'eff',
            email: 'req.body.payload.email'
        }
    })
})

module.exports = router;