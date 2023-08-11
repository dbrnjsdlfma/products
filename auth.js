const config = require('./config')
const jwt = require('jsonwebtoken')

const generateToken = (user) => { 
    return jwt.sign({
        _id : user._id ,
        name : user.email ,
        userId : user.userId ,
        isAdmin : user.isAdmin , 
        createdAt : user.createdAt ,

    }, config.JWT_SECRET,
    {
        expiresIn: '1d' ,
        issuer : 'consignment'
    })
}

const isAuth = (req, res, next) => { 
    const bearToken = req.headers.authorization 
    if(!bearToken) {
        res.status(401).json({ message : 'Token is not supplied'}) 
    } else {
        const token = bearToken.slice(7, bearToken.length) 
        jwt.verify(token, config.JWT_SECRET, (err, userInfo) => {
            if(err && err.name === 'TokenExpiredError') {
                res.status(419).json({ code : 419 , message : 'token expried ~!'})
            } else if(err){
                res.status(401).json({ code : 401 , message : 'Invalid Token ~!'})
            } else {
                req.user = userInfo 
                next()
            }
        })
    
    }
}

const isAdmin = (req, res, next) => {
    if(req.user && req.user.isAdmin) {
        next()
    } else {
        res.status(401).json({ code : 401 , message : 'You are not valid admin user'})
    }
}

module.exports = {
    generateToken ,
    isAuth ,
    isAdmin ,
}