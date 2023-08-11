const mongoose = require('mongoose')
const { boolean } = require('webidl-conversions')

const { Schema } = mongoose

const { Types: { ObjectId } } = Schema

const productSchema = new Schema ({
    category : {
        type : String ,
        required : true ,
        trim : true ,
    },
    name : {
        type : String ,
        required : true ,
        trim : true ,
    } ,
    description : {
        type : String ,
        required: false ,
    } ,
    imgUrl : {
        type : String ,
        require : true ,
        trim : true
    } ,
    user : {
        type : ObjectId ,
        required : true ,
        ref: 'User' ,
    } , 
    createdAt : {
        type : Date ,
        default : Date.now ,
    } , 
    lastModifiedAt : {
        type : Date ,
        default : Date.now ,
    }
})

// User = users
const Product = mongoose.model('product', productSchema) 
module.exports = Product