const jwt = require('jsonwebtoken')
const secretKey = 'secretkey'

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader.split(' ')[1]

    if (token=== null){
        res.status(401).json({message: 'Token Required'})
    }

    jwt.verify(token, secretKey, (err,user)=>{
        if (err){
            res.status(403).json({error: 'Invalid Token'})
        }
        else {
            req.user = user;
            next()
        }
    })
}

module.exports = authenticateToken;