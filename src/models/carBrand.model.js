const mongoose = require('mongoose')
const Schema = mongoose.Schema


const requestsSchema = new Schema({       
    name: { type: String,default:null},
    carImage: { type:String, default: null },// 1 means active
    status: { type:Number, default: 1 },// 1 means active   
    isDeleted: { type: Boolean, default: false },
},
    {
        timestamps: true,
    })
  
const car = mongoose.model('carBrand', requestsSchema)
module.exports = car