const mongoose = require('mongoose')
const Schema = mongoose.Schema


const requestsSchema = new Schema({       
    name: {type: String, trim: true, maxlength: 128, default: null,unique:true},
    Image: { type:String, default: null },// 1 means active
    status: { type:Number, default: 1 },// 1 means active   
    isDeleted: { type: Boolean, default: false },
},
    {
        timestamps: true,
    })
  
const FuelType = mongoose.model('FuelType', requestsSchema)
module.exports = FuelType