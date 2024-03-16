const mongoose = require('mongoose')
const Schema = mongoose.Schema

const requestsSchema = new Schema({  
    name: { type: String,default:null},
    carID:{type:mongoose.Schema.Types.ObjectId,ref:'carBrand'},
    categoryID:{type:mongoose.Schema.Types.ObjectId,ref:'carCategory'},
    carImage: { type:String, default: null },// 1 means active
    status: { type:Number, default: 1 },// 1 means active   
    isDeleted: { type: Boolean, default: false },
},
    {
        timestamps: true,
    })
  
const carmodel = mongoose.model('carModel', requestsSchema)
module.exports = carmodel