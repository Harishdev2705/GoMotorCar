const mongoose = require('mongoose')
const Schema = mongoose.Schema


const requestsSchema = new Schema({       
    name: {type: String, trim: true, maxlength: 128, default: null,unique:true},
    status: { type:Number, default: 1 },// 1 means active   
    isDeleted: { type: Boolean, default: false },
},
    {
        timestamps: true,
    })
  
const transmission = mongoose.model('transmissiontype', requestsSchema)
module.exports = transmission