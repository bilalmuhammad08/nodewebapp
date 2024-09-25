const mongoose = require('mongoose')
const {Schema} = mongoose;


const brandShema = new Schema({
        brandName:{
            type: String,
            required: true
        },
        brandImage:{
            type:[String],
            required: true
        },
        isBlocked:{
            type: Boolean,
            default: false
        },
        createdAt:{
            type: Date,
            default: Date.now
        }
})

const Brand = mongoose.model("Brand", brandShema);

module.exports = Brand;
