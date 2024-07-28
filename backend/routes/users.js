const express = require('express')
const router  = express.Router()
const jwt = require('jsonwebtoken')
const secretKey = 'secretkey'

require('dotenv').config();


const user = require('../models/userModel')

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    // Here, you can create or find a user in your database based on profile.id
    // For example:
    User.findOne({ googleId: profile.id })
      .then(user => {
        if (user) {
          return done(null, user);
        } else {
          // Create a new user
          const newUser = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value
          });
          newUser.save()
            .then(user => done(null, user))
            .catch(err => done(err, null));
        }
      })
      .catch(err => done(err, null));
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
    .catch(err => done(err, null));
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  // Successful authentication, redirect home or set a cookie
  res.redirect('/home');
});


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
                res.status(400).json("Incorrect Password")
            }
        }
        else{
            res.status(400).json("No record found")
        }
    })
})

router.post('/register',(req,res)=>{
    user.create(req.body.payload).then(
        users => {
        res.status(201).json({
            message: 'User registered successfully',
            data: {
                name: 'eff',
                email: 'req.body.payload.email'
            }
        })}
    ).catch(err=> res.status(400).json(err))

})

module.exports = router;