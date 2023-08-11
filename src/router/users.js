const express = require('express')
const User = require('../consignment/User')
const expressAsyncHandler = require('express-async-handler')
const { generateToken, isAuth } = require('../../auth')

const router = express.Router() //

router.post('/register', expressAsyncHandler (async(req, res, next) => { // /api/users/register
    console.log(req.body)
    const user = new User({
        name : req.body.name ,
        email : req.body.email ,
        userId : req.body.userId ,
        password : req.body.password ,
        isAdmin : req.body.isAdmin ,
    })
    const newUser = await user.save()
    if(!newUser) {
        res.status(401).json({ code : 401 , message : 'Invalid User Data' })
    } else {
        const { name , email, userId, isAdmin, createAt } = newUser
        res.json({
            code : 200 ,
            token : generateToken(newUser) ,
            name , email, userId, isAdmin, createAt
        })
    }
}))

router.post('/login',expressAsyncHandler( async (req, res, next) => { // /api/users/login
    console.log(req.body)
    const loginUser = await User.findOne({
        email : req.body.email ,
        password : req.body.password ,
    })
    if(!loginUser) {
        res.status(401).json({ code : 401, message : 'Invalid Email or Password'})
    } else {
        const { name , email, userId , isAdmin , createAt } =loginUser
        res.json({
            code : 200 , 
            token : generateToken(loginUser) ,
            name , email, userId , isAdmin , createAt ,
        })
    }
}))

router.post('/logout', isAuth , expressAsyncHandler ( async (req, res, next) => {
    const tokenIatTime = req.user.iat
    const tokenExpTime = req.user.exp
    const tokenTimeOut = tokenIatTime - tokenExpTime
    console.log(req.headers.authorization)
    console.log(tokenTimeOut)
    res.json('로그아웃')
}))

router.put('/:id' ,isAuth , expressAsyncHandler ( async (req, res, next) => { // /api/users/:id
    const user = await User.findById(req.params.id)
    console.log(user)
    if(!user) {
        res.status(404).json({ code : 404 , message : 'User not Found'})
    } else {
        user.name = req.body.name || user.name 
        user.email = req.body.email || user.email 
        user.password = req.body.password || user.password
        user.isAdmin = req.body.isAdmin || user.isAdmin
        user.lastModifiedAt = new Date()
        const updatedUser = await user.save()
        const { name , email , userId , isAdmin, createAt } = updatedUser
        res.json({
            code : 200 ,
            token : generateToken(updatedUser) ,
            name , email , userId , isAdmin, createAt ,
        })
    }
}))

router.delete('/:id' ,isAuth, expressAsyncHandler ( async (req, res, next) => { // /api/users/{id}
    const user = await User.findByIdAndDelete(req.params.id)
    if(!user) {
        res.status(404).json({ code : 404 , message : 'User not Found'})
    } else {
        res.status(204).json({ code : 204 , message : 'User Delete Success'})
    }
}))

module.exports = router

