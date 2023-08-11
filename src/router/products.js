const express = require('express')
const Product = require('../consignment/Product')
const expressAsyncHandler = require('express-async-handler')
const { isAuth } = require('../../auth')

const router = express.Router()

router.get('/', expressAsyncHandler( async (req, res, next) => { // /api/products/
    const productList = await Product.find().populate('user')
    if(productList.length === 0) {
        res.status(404).json({ code: 404 , message : 'Failed to find products !'})
    } else {
        res.json({ code : 200 , productList })
    }
})) 

router.get('/:id', isAuth, expressAsyncHandler( async (req, res, next) => { // /api/products/{id}
    const product = await Product.findOne({
        user : req.user._id ,
        _id : req.params.id ,
    }).populate('user')
    if(!product) {
        res.status(404).json({ code : 404 , message : 'Product Not Found'})
    } else {
        res.status(200).json({ code : 200 , product })
    }
}))

router.post('/', isAuth, expressAsyncHandler( async (req, res, next) => { // /api/products/
    const searchProduct = await Product.findOne({
        user : req.user._id ,
        name : req.body.name , 
    })
    console.log(searchProduct)
    if(searchProduct) {
        res.status(204).json( {code : 204 , message : '이미 상품이 있습니다'})
    } else {
        const product = new Product({
            user : req.user._id ,
            category : req.body.category ,
            name : req.body.name ,
            description : req.body.description , 
            imgUrl : req.body,imgUrl , 
        })
        const newProduct = product.save()
        if(!newProduct) {
            res.status(401).json({ code : 401 , message : "Failed to save product"})
        } else {
            res.status(201).json({ 
                code : 201 , 
                message : "New product created" ,
                newProduct
            })
        }
    }
}))

router.put('/:id', isAuth , expressAsyncHandler( async (req, res, next) => { // /api/products/{id}
    const product = await Product.findOne({
        user : req.user._id ,
        _id : req.params.id ,
    }).populate('user')
    console.log(product)
    if(!product) {
        res.status(404).json({ code : 404 , message : 'Product Not Found'})
    } else {
        product.name = req.body.name || product.name
        product.category = req.body.category || product.category
        product.description = req.body.description || product.description
        product.imgUrl = req.body.imgUrl || product.imgUrl
        product.lastModifiedAt = new Date()
        
        const updateProduct = await product.save()
        res.json({
            code : 200 , 
            message : 'Products Updated',
            updateProduct
        })
    }
}))

router.delete('/:id', isAuth , expressAsyncHandler( async (req, res, next) => { // /api/products/{id}
    const product = await Product.findOne({
        user : req.user._id ,
        _id : req.params.id ,
    })
    if(!product) {
        res.status(404).json({ code : 404 , message : 'Products Not Found'})
    } else {
        await product.deleteOne({
            user : req.user._id ,
            _id : req.params.id ,
        })
        res.status(204).json({ code : 204 , message : 'Products deleted SuccessFully!'})        
    }
}))

module.exports = router